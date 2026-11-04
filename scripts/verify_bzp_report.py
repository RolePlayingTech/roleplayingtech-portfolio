#!/usr/bin/env python3
"""Quality gate and KPI calculator for the BZP AI procurement report (#39).

Modes:
  1. KPI reporting:
       py scripts/verify_bzp_report.py --print-kpis
  2. Full validation gate (default, exits 0 on pass, 1 on any error):
       py scripts/verify_bzp_report.py

Uses only the Python 3.12 standard library.
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date as dt_date
from decimal import Decimal, ROUND_HALF_UP
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from typing import Any
import urllib.parse


SNAPSHOT_DATE = "2026-11-03"
SITE_ORIGIN = "https://roleplayingtech.com/"
BZP_URL_PREFIX = "https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/"
BZP_NOTICE_URL_RE = re.compile(
    r"^https://ezamowienia\.gov\.pl/mo-client-board/bzp/notice-details/id/"
    r"(08d[0-9a-f]{5}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$"
)
BZP_NOTICE_URL_SCAN_RE = re.compile(
    r"https://ezamowienia\.gov\.pl/mo-client-board/bzp/notice-details/id/([0-9a-f-]{36})",
    re.I,
)
ALLOWED_EZAMOWIENIA_NON_NOTICE_URLS = {
    "https://ezamowienia.gov.pl",
    "https://ezamowienia.gov.pl/",
    "https://ezamowienia.gov.pl/mo-board/api/v1/notice",
}
COMPETITION_CLIFF_PLN = Decimal("170000")

# Companion / excluded BZP notice UUIDs verified directly against local BZP API caches
# (ContractNotice / AgreementIntentionNotice / NoticeUpdateNotice siblings of core records,
# plus excluded boundary notices explicitly cited in methodology/prose):
VERIFIED_COMPANION_NOTICE_UUIDS: dict[str, str] = {
    "08dceeeb-13ff-f117-1a9f-3e0001b7af0e": "2024/BZP 00552151 (AgreementIntentionNotice, CREWŁ w Zgierzu — companion to 2024/BZP 00620147)",
    "08de7ddb-2c8d-db43-056e-e50001ac545f": "2026/BZP 00146056 (ContractNotice, USK w Opolu — companion to 2026/BZP 00201117)",
    "08de8364-d2b0-eb0b-056e-e5000104db65": "2026/BZP 00157076 (NoticeUpdateNotice, USK w Opolu — companion to 2026/BZP 00201117)",
    "08dde563-ea1c-ca51-e769-360001c7d9f1": "2025/BZP 00394250 (ContractNotice, WSS w Legnicy — companion to 2025/BZP 00478008)",
    "08de7528-7de7-3c05-056e-e50001abeac7": "2026/BZP 00130128 (ContractNotice, Narodowy Instytut Kardiologii — companion to 2026/BZP 00213382)",
    "08de46c4-5d8c-5aad-d6d3-f500016282ce": "2025/BZP 00622781 (ContractNotice, UM w Poznaniu — companion to 2026/BZP 00146627)",
    "08de1c60-b4cb-2009-6f2a-fc000173d783": "2025/BZP 00517087 (TenderResultNotice, UOKiK — excluded threshold boundary notice)",
    "08dd0a25-4a46-c8c7-985c-bb0001350a3c": "2024/BZP 00608321 (TenderResultNotice, Politechnika Warszawska — excluded multi-lot notice cited in methodology)",
    "08dd0a26-fc8f-14fb-985c-bb0001350a9b": "2024/BZP 00608403 (TenderResultNotice, Politechnika Warszawska — excluded multi-lot notice cited in methodology)",
    "08dd7c00-0ee1-f000-eaaa-350001a35a15": "2025/BZP 00191385 (TenderResultNotice, WUP w Szczecinie — excluded boundary notice cited in methodology)",
    "08dd9e82-f084-d984-eaaa-350001a4db0d": "2025/BZP 00253400 (TenderResultNotice, Zespół Szkół nr 18 — excluded boundary notice cited in methodology)",
    "08dd9f4c-34bd-8c7d-eaaa-350001a4e7d8": "2025/BZP 00255537 (TenderResultNotice, Politechnika Warszawska — excluded boundary notice cited in methodology)",
    "08dda366-3947-85cb-eaaa-350001a51782": "2025/BZP 00263281 (TenderResultNotice, ZOZ w Sochaczewie — excluded boundary notice cited in methodology)",
    "08dda4b8-7f87-676b-e710-760001de8883": "2025/BZP 00263829 (TenderResultNotice, UKW w Bydgoszczy — excluded boundary notice cited in methodology)",
    "08de154c-b18b-8e69-6f2a-fc0001f5cf0a": "2025/BZP 00497656 (TenderResultNotice, MSW w Siedlcach — retry/companion notice cited in methodology)",
    "08dea513-744a-baf1-5fad-9500011a21a1": "2026/BZP 00219608 (TenderResultNotice, Kociewskie Centrum Zdrowia — retry/companion notice cited in methodology)",
    "08deb19c-5e21-ee2d-5fad-9500011feb52": "2026/BZP 00243856 (TenderResultNotice, WUP we Wrocławiu — retry/companion notice cited in methodology)",
    "08deb707-8c33-e1be-5fad-9500012b9ff1": "2026/BZP 00254063 (TenderResultNotice, Kociewskie Centrum Zdrowia — retry/companion notice cited in methodology)",
    "08debd45-8128-d4f9-5fad-9500015c51b6": "2026/BZP 00267052 (TenderResultNotice, Szpital Miejski w Gliwicach — retry/companion notice cited in methodology)",
    "08dec07f-348e-b2c2-5fad-9500015c71a7": "2026/BZP 00271902 (TenderResultNotice, Szpital Specjalistyczny im. L. Rydygiera w Krakowie — companion notice)",
    "08decb83-1f9e-bca5-5fad-9500015f51db": "2026/BZP 00291854 (TenderResultNotice, WUP w Kielcach — excluded boundary notice cited in methodology)",
    "08ded376-5681-c34c-92be-eb0001c25126": "2026/BZP 00310877 (TenderResultNotice, Uniwersytet Jagielloński — companion notice cited in methodology)",
}

# Forensic benchmarks deterministically extracted from the 159-notice BZP HTML protocol audit
# (protocol sections beyond top-level summary JSON fields: Section 4 estimates, Section 5 criteria,
# Section 6 rejected bids, Section 7 SME status, statutory sole-source & Art. 255 cancellation grounds):
FORENSIC_HTML_BENCHMARKS: dict[str, Any] = {
    # 1. Effective zero-surviving-rival competition after bid rejections + expanded statutory sole-source:
    "effective_zero_rival_contracts": 59,           # out of 110 signed core contracts (53.6%)
    "effective_zero_rival_sum_mln": Decimal("19.54"),
    "effective_zero_rival_spend_pct": Decimal("60.7"),
    "bid_rejection_rate_pct": Decimal("26.3"),
    "statutory_sole_source_contracts": 10,
    "statutory_sole_source_sum_mln": Decimal("3.46"),
    # 2. Evaluation criteria with zero substantive quality weight:
    "zero_quality_criteria_software_pct": Decimal("72.2"),
    "zero_quality_criteria_overall_pct": Decimal("63.5"),
    # 3. Median award price vs contracting authority's net/budget estimate:
    "price_vs_estimate_crowded_pct": Decimal("54.0"),   # equivalent to a 46.0% / 46% discount
    "price_discount_crowded_pct": Decimal("46.0"),
    "price_vs_estimate_zero_rival_pct": Decimal("100.0"),
    # 4. Cancelled core proceedings statutory breakdown (14 of 31 = 45.2% budget shock;
    #    52 explicit bids across 23 notices + >=1 bid in 24th notice 2026/BZP 00226264 = 53+ bids):
    "cancelled_budget_shock_count": 14,
    "cancelled_budget_shock_pct": Decimal("45.2"),
    "cancelled_with_bids_count": 24,
    "cancelled_min_bids": 53,
    "cancelled_stale_bids": 61,
    # 5. SME (MŚP) contractor share across signed core contracts:
    "sme_spend_pct": Decimal("93.8"),
    "sme_contracts_pct": Decimal("95.5"),
}

REQUIRED_KEYS = (
    "id",
    "bzp",
    "status",
    "date",
    "year",
    "title",
    "org",
    "sector",
    "category",
    "url",
)

ALLOWED_STATUSES = {"resolved", "open_or_pending", "cancelled"}
ALLOWED_SUB_STATUSES = {"open_for_bids", "pending_result"}
CORE_CATEGORIES = ("software_deploy", "hardware_lab", "training", "consulting")
ALLOWED_CATEGORIES = set(CORE_CATEGORIES) | {"incidental"}
ALLOWED_AI_SCOPES = {"pure", "mixed", "incidental"}

ALLOWED_PRESET_PARAMS = {
    "q",
    "status",
    "sub",
    "cat",
    "sector",
    "prov",
    "year",
    "cyear",
    "ymode",
    "single",
    "sole",
    "btier",
    "eu",
    "incidental",
    "pure",
    "sort",
}
ALLOWED_PRESET_STATUSES = {"all", "resolved", "open_or_pending", "cancelled"}
ALLOWED_PRESET_SORTS = {"amount_desc", "amount_asc", "date_desc", "bids_desc", "bids_asc"}
ALLOWED_PRESET_YMODES = {"notice", "contract"}
ALLOWED_PRESET_BTIERS = {"", "2-3", "4p"}

CAT_LABELS_PL = {
    "software_deploy": "Wdrożenia i systemy AI",
    "hardware_lab": "Sprzęt GPU, laboratoria i aparatura",
    "training": "Szkolenia, kursy i warsztaty",
    "consulting": "Badania, audyty i analizy",
    "incidental": "Poboczne (remonty, meble, catering)",
}
CAT_LABELS_EN = {
    "software_deploy": "AI software & deployments",
    "hardware_lab": "GPU servers, labs & medical gear",
    "training": "Trainings, courses & workshops",
    "consulting": "Research studies, audits & advisory",
    "incidental": "Incidental (renovations, furniture, catering)",
}

HTML_FILES = (
    "pl/lab/przetargi-ai/index.html",
    "en/lab/ai-tenders/index.html",
    "pl/lab/index.html",
    "en/lab/index.html",
    "pl/index.html",
    "en/index.html",
)

MD_REPORT_FILES = (
    "docs/lab/bzp-methodology.md",
    "docs/lab/bzp-single-bid-investigation.md",
    "docs/lab/bzp-press-kit.md",
)

VOID_HTML_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}

ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


# ---------------------------------------------------------------------------
# Exact arithmetic & bilingual formatting helpers
# ---------------------------------------------------------------------------


def to_dec(val: int | float | str | Decimal) -> Decimal:
    if isinstance(val, Decimal):
        return val
    return Decimal(str(val))


def round_half_up(val: Decimal, places: int = 0) -> Decimal:
    quant = Decimal("1") if places == 0 else Decimal("1." + ("0" * places))
    return val.quantize(quant, rounding=ROUND_HALF_UP)


def round_int(val: Decimal) -> int:
    return int(round_half_up(val, 0))


def calc_median_dec(values: list[Decimal]) -> Decimal:
    if not values:
        return Decimal("0")
    s = sorted(values)
    mid = len(s) // 2
    if len(s) % 2 == 1:
        return s[mid]
    return (s[mid - 1] + s[mid]) / Decimal("2")


def pct_dec(num: int | Decimal, den: int | Decimal) -> Decimal:
    d_den = to_dec(den)
    if d_den == 0:
        return Decimal("0")
    return (to_dec(num) * Decimal("100")) / d_den


def fmt_num(val: Decimal, places: int, lang: str) -> str:
    r = round_half_up(val, places)
    s = f"{r:.{places}f}"
    return s.replace(".", ",") if lang == "pl" else s


def fmt_pct(num: int | Decimal, den: int | Decimal, lang: str, places: int = 1) -> str:
    return f"{fmt_num(pct_dec(num, den), places, lang)}%"


def fmt_mln(pln: Decimal, lang: str) -> str:
    mln = pln / Decimal("1000000")
    num_s = fmt_num(mln, 2, lang)
    return f"{num_s} mln zł" if lang == "pl" else f"{num_s}M PLN"


def fmt_mln_num(pln: Decimal, lang: str) -> str:
    return fmt_num(pln / Decimal("1000000"), 2, lang)


def fmt_k(pln: Decimal, lang: str, places: int = 1) -> str:
    k = pln / Decimal("1000")
    num_s = str(round_int(k)) if places == 0 else fmt_num(k, places, lang)
    return f"{num_s} tys. zł" if lang == "pl" else f"{num_s}k PLN"


def fmt_int_grouped(n: int, lang: str) -> str:
    sep = " " if lang == "pl" else ","
    sign = "-" if n < 0 else ""
    digits = f"{abs(n):,}".replace(",", sep)
    return f"{sign}{digits}"


def fmt_exact_pln(pln: Decimal, lang: str) -> str:
    r = round_half_up(pln, 2)
    whole = int(r)
    frac = abs(r - Decimal(whole))
    cent_s = f"{int(round_half_up(frac * 100, 0)):02d}"
    whole_s = fmt_int_grouped(whole, lang)
    if lang == "pl":
        return f"{whole_s},{cent_s} zł"
    return f"{whole_s}.{cent_s} PLN"


def normalize_sp_zoo_key(name: str) -> str:
    """Normalizes case, whitespace, and spacing/dots inside 'Sp. z o.o.'."""
    s = re.sub(r"\s+", " ", name.strip()).casefold()
    s = re.sub(
        r"\bsp\s*\.?\s*z\s*\.?\s*o\s*\.?\s*o\s*\.?(?=\s|$|,)",
        "sp. z o.o.",
        s,
    )
    return s


def canonical_vendor_entity_key(name: str) -> str:
    """Normalizes company legal suffixes for cross-checking #fig-vendors."""
    s = re.sub(r"\s+", " ", name.strip()).casefold()
    s = re.sub(r"\bspółka z ograniczoną odpowiedzialnością\b", "sp. z o.o.", s)
    s = re.sub(r"\bspółka z o\s*\.\s*o\s*\.?(?=\s|$|,)", "sp. z o.o.", s)
    s = re.sub(
        r"\bsp\s*\.?\s*z\s*\.?\s*o\s*\.?\s*o\s*\.?(?=\s|$|,)",
        "sp. z o.o.",
        s,
    )
    return s


# ---------------------------------------------------------------------------
# KPI Calculation Engine
# ---------------------------------------------------------------------------


@dataclass
class CategoryKpi:
    key: str
    proc_count: int
    proc_pct: Decimal
    signed_count: int
    sum_pln: Decimal
    spend_pct: Decimal
    median_pln: Decimal
    with_bids_count: int
    single_bid_count: int
    single_bid_pct: Decimal
    median_bids: Decimal


@dataclass
class YearKpi:
    year_key: str
    proc_count: int
    signed_count: int
    sum_pln: Decimal


@dataclass
class GroupKpi:
    key: str
    proc_count: int
    proc_pct: Decimal
    signed_count: int
    sum_pln: Decimal
    spend_pct: Decimal


@dataclass
class VendorKpi:
    canon_key: str
    display_name: str
    raw_variants: tuple[str, ...]
    signed_count: int
    sum_pln: Decimal
    single_bid_count: int


@dataclass
class CompetitionTierKpi:
    key: str
    signed_count: int
    signed_pct_core: Decimal
    signed_pct_comp: Decimal
    sum_pln: Decimal
    spend_pct_core: Decimal
    spend_pct_comp: Decimal


@dataclass
class CompetitionSliceKpi:
    key: str
    with_bids_count: int
    count_pct_comp: Decimal
    sum_pln: Decimal
    spend_pct_comp: Decimal
    spend_pct_core: Decimal
    single_bid_count: int
    single_bid_pct: Decimal
    median_bids: Decimal
    median_pln: Decimal


@dataclass
class CancellationGroupKpi:
    key: str
    total_count: int
    resolved_count: int
    open_or_pending_count: int
    cancelled_count: int
    concluded_count: int
    cancelled_pct_concluded: Decimal
    cancelled_pct_all: Decimal


@dataclass
class QuarterKpi:
    quarter_key: str
    start_date: str
    end_date: str
    proc_count: int
    hc_proc_count: int
    signed_count: int
    sum_pln: Decimal
    with_bids_count: int
    single_bid_count: int
    single_bid_pct: Decimal
    zero_rival_count: int
    zero_rival_pct: Decimal


def is_valid_iso_date(val: Any) -> bool:
    if not isinstance(val, str) or not ISO_DATE_RE.match(val):
        return False
    try:
        dt_date.fromisoformat(val)
        return True
    except ValueError:
        return False


def effective_sub_status(r: dict[str, Any]) -> str | None:
    if r.get("status") != "open_or_pending":
        return None
    sub = r.get("subStatus")
    if sub in ALLOWED_SUB_STATUSES:
        return sub
    dl = r.get("deadline")
    if isinstance(dl, str) and dl >= SNAPSHOT_DATE:
        return "open_for_bids"
    return "pending_result"


def compute_kpis(records: list[dict[str, Any]]) -> dict[str, Any]:
    core = [r for r in records if r.get("category") != "incidental"]
    incidental = [r for r in records if r.get("category") == "incidental"]

    def is_signed(r: dict[str, Any]) -> bool:
        return (
            r.get("status") == "resolved"
            and isinstance(r.get("amountPln"), (int, float))
            and not isinstance(r.get("amountPln"), bool)
        )

    core_signed = [r for r in core if is_signed(r)]
    inc_signed = [r for r in incidental if is_signed(r)]

    core_sum = sum((to_dec(r["amountPln"]) for r in core_signed), Decimal("0"))
    inc_sum = sum((to_dec(r["amountPln"]) for r in inc_signed), Decimal("0"))
    core_median = calc_median_dec([to_dec(r["amountPln"]) for r in core_signed])

    def status_breakdown(pool: list[dict[str, Any]]) -> dict[str, int]:
        st_counts = Counter(r.get("status") for r in pool)
        open_pool = [r for r in pool if r.get("status") == "open_or_pending"]
        sub_counts = Counter(effective_sub_status(r) for r in open_pool)
        return {
            "total": len(pool),
            "resolved": st_counts.get("resolved", 0),
            "open_or_pending": st_counts.get("open_or_pending", 0),
            "open_for_bids": sub_counts.get("open_for_bids", 0),
            "pending_result": sub_counts.get("pending_result", 0),
            "cancelled": st_counts.get("cancelled", 0),
        }

    # aiScope breakdown in core
    scope_stats: dict[str, dict[str, Any]] = {}
    for scope_key in ("pure", "mixed", "missing"):
        if scope_key == "missing":
            spool = [r for r in core if r.get("aiScope") not in {"pure", "mixed"}]
        else:
            spool = [r for r in core if r.get("aiScope") == scope_key]
        ssigned = [r for r in spool if is_signed(r)]
        ssum = sum((to_dec(r["amountPln"]) for r in ssigned), Decimal("0"))
        scope_stats[scope_key] = {
            "proc_count": len(spool),
            "signed_count": len(ssigned),
            "sum_pln": ssum,
            "spend_pct": pct_dec(ssum, core_sum),
        }

    # Core categories
    categories: dict[str, CategoryKpi] = {}
    for ck in CORE_CATEGORIES:
        cp = [r for r in core if r.get("category") == ck]
        cs = [r for r in core_signed if r.get("category") == ck]
        csum = sum((to_dec(r["amountPln"]) for r in cs), Decimal("0"))
        cmed = calc_median_dec([to_dec(r["amountPln"]) for r in cs])
        wb = [
            r
            for r in cs
            if isinstance(r.get("bids"), int) and not isinstance(r.get("bids"), bool)
        ]
        sb = [r for r in wb if r["bids"] == 1]
        mbids = calc_median_dec([to_dec(r["bids"]) for r in wb])
        categories[ck] = CategoryKpi(
            key=ck,
            proc_count=len(cp),
            proc_pct=pct_dec(len(cp), len(core)),
            signed_count=len(cs),
            sum_pln=csum,
            spend_pct=pct_dec(csum, core_sum),
            median_pln=cmed,
            with_bids_count=len(wb),
            single_bid_count=len(sb),
            single_bid_pct=pct_dec(len(sb), len(wb)),
            median_bids=mbids,
        )

    sw_hw_sum = categories["software_deploy"].sum_pln + categories["hardware_lab"].sum_pln
    sw_hw_proc = categories["software_deploy"].proc_count + categories["hardware_lab"].proc_count
    sw_hw_signed = categories["software_deploy"].signed_count + categories["hardware_lab"].signed_count
    sw_hw_spend_pct = pct_dec(sw_hw_sum, core_sum)
    sw_hw_proc_pct = pct_dec(sw_hw_proc, len(core))

    # Annual dynamics: (a) by notice year
    notice_years: dict[str, YearKpi] = {}
    for y in ("2024", "2025", "2026"):
        yp = [r for r in core if str(r.get("year")) == y]
        ys = [r for r in core_signed if str(r.get("year")) == y]
        ysum = sum((to_dec(r["amountPln"]) for r in ys), Decimal("0"))
        notice_years[y] = YearKpi(year_key=y, proc_count=len(yp), signed_count=len(ys), sum_pln=ysum)

    notice_mult_2026_2024 = (
        notice_years["2026"].sum_pln / notice_years["2024"].sum_pln
        if notice_years["2024"].sum_pln > 0
        else Decimal("0")
    )

    # Annual dynamics: (b) by contract year (contractDate[:4])
    contract_year_keys = sorted(
        {"2023", "2024", "2025", "2026"}
        | {
            str(r.get("contractDate"))[:4]
            for r in core_signed
            if isinstance(r.get("contractDate"), str) and len(r["contractDate"]) >= 4
        }
    )
    contract_years: dict[str, YearKpi] = {}
    for cy in contract_year_keys:
        ys = [
            r
            for r in core_signed
            if isinstance(r.get("contractDate"), str) and r["contractDate"][:4] == cy
        ]
        ysum = sum((to_dec(r["amountPln"]) for r in ys), Decimal("0"))
        contract_years[cy] = YearKpi(year_key=cy, proc_count=len(ys), signed_count=len(ys), sum_pln=ysum)

    contract_mult_2026_2024 = (
        contract_years["2026"].sum_pln / contract_years["2024"].sum_pln
        if contract_years.get("2024") and contract_years["2024"].sum_pln > 0
        else Decimal("0")
    )

    # Competition overall in core
    core_with_bids = [
        r
        for r in core_signed
        if isinstance(r.get("bids"), int) and not isinstance(r.get("bids"), bool)
    ]
    core_single_bids = [r for r in core_with_bids if r["bids"] == 1]
    core_sole_source = [r for r in core_signed if r.get("bids") is None]
    core_zero_rival = [r for r in core_signed if r.get("bids") == 1 or r.get("bids") is None]
    core_bids_2_3 = [r for r in core_with_bids if 2 <= r["bids"] <= 3]
    core_bids_4_plus = [r for r in core_with_bids if r["bids"] >= 4]
    core_missing_bids = len(core_signed) - len(core_with_bids)
    core_single_bid_pct = pct_dec(len(core_single_bids), len(core_with_bids))
    core_median_bids = calc_median_dec([to_dec(r["bids"]) for r in core_with_bids])
    competitive_sum = sum((to_dec(r["amountPln"]) for r in core_with_bids), Decimal("0"))
    top_bids_records = sorted(
        core_with_bids,
        key=lambda r: (r["bids"], to_dec(r["amountPln"])),
        reverse=True,
    )

    def make_comp_tier(
        tkey: str,
        pool: list[dict[str, Any]],
        in_competitive: bool,
    ) -> CompetitionTierKpi:
        tsum = sum((to_dec(r["amountPln"]) for r in pool), Decimal("0"))
        return CompetitionTierKpi(
            key=tkey,
            signed_count=len(pool),
            signed_pct_core=pct_dec(len(pool), len(core_signed)),
            signed_pct_comp=pct_dec(len(pool), len(core_with_bids)) if in_competitive else Decimal("0"),
            sum_pln=tsum,
            spend_pct_core=pct_dec(tsum, core_sum),
            spend_pct_comp=pct_dec(tsum, competitive_sum) if in_competitive else Decimal("0"),
        )

    comp_tiers: dict[str, CompetitionTierKpi] = {
        "single_bid": make_comp_tier("single_bid", core_single_bids, True),
        "sole_source": make_comp_tier("sole_source", core_sole_source, False),
        "zero_rival": make_comp_tier("zero_rival", core_zero_rival, False),
        "bids_2_3": make_comp_tier("bids_2_3", core_bids_2_3, True),
        "bids_4_plus": make_comp_tier("bids_4_plus", core_bids_4_plus, True),
    }

    # Software deployments zero-rival breakdown (single-bid + sole-source)
    sw_signed_pool = [r for r in core_signed if r.get("category") == "software_deploy"]
    sw_sum = categories["software_deploy"].sum_pln
    sw_single_pool = [r for r in sw_signed_pool if r.get("bids") == 1]
    sw_sole_pool = [r for r in sw_signed_pool if r.get("bids") is None]
    sw_zero_rival_pool = [r for r in sw_signed_pool if r.get("bids") == 1 or r.get("bids") is None]
    sw_single_sum = sum((to_dec(r["amountPln"]) for r in sw_single_pool), Decimal("0"))
    sw_sole_sum = sum((to_dec(r["amountPln"]) for r in sw_sole_pool), Decimal("0"))
    sw_zero_rival_sum = sum((to_dec(r["amountPln"]) for r in sw_zero_rival_pool), Decimal("0"))
    sw_zero_rival = {
        "signed_count": len(sw_signed_pool),
        "sum_pln": sw_sum,
        "single_bid_count": len(sw_single_pool),
        "single_bid_sum_pln": sw_single_sum,
        "single_bid_spend_pct": pct_dec(sw_single_sum, sw_sum),
        "sole_source_count": len(sw_sole_pool),
        "sole_source_sum_pln": sw_sole_sum,
        "sole_source_spend_pct": pct_dec(sw_sole_sum, sw_sum),
        "zero_rival_count": len(sw_zero_rival_pool),
        "zero_rival_count_pct": pct_dec(len(sw_zero_rival_pool), len(sw_signed_pool)),
        "zero_rival_sum_pln": sw_zero_rival_sum,
        "zero_rival_spend_pct": pct_dec(sw_zero_rival_sum, sw_sum),
    }

    def make_comp_slice(skey: str, pool: list[dict[str, Any]]) -> CompetitionSliceKpi:
        ssum = sum((to_dec(r["amountPln"]) for r in pool), Decimal("0"))
        ssb = [r for r in pool if r["bids"] == 1]
        return CompetitionSliceKpi(
            key=skey,
            with_bids_count=len(pool),
            count_pct_comp=pct_dec(len(pool), len(core_with_bids)),
            sum_pln=ssum,
            spend_pct_comp=pct_dec(ssum, competitive_sum),
            spend_pct_core=pct_dec(ssum, core_sum),
            single_bid_count=len(ssb),
            single_bid_pct=pct_dec(len(ssb), len(pool)),
            median_bids=calc_median_dec([to_dec(r["bids"]) for r in pool]),
            median_pln=calc_median_dec([to_dec(r["amountPln"]) for r in pool]),
        )

    cliff_170k: dict[str, CompetitionSliceKpi] = {
        "below_170k": make_comp_slice(
            "below_170k",
            [r for r in core_with_bids if to_dec(r["amountPln"]) < COMPETITION_CLIFF_PLN],
        ),
        "at_or_above_170k": make_comp_slice(
            "at_or_above_170k",
            [r for r in core_with_bids if to_dec(r["amountPln"]) >= COMPETITION_CLIFF_PLN],
        ),
    }

    eu_competition: dict[str, CompetitionSliceKpi] = {
        "eu": make_comp_slice("eu", [r for r in core_with_bids if r.get("eu") is True]),
        "non_eu": make_comp_slice("non_eu", [r for r in core_with_bids if r.get("eu") is not True]),
    }

    # Concluded vs overall cancellation rates (all, core, and per core sector)
    def make_cancellation_kpi(ckey: str, pool: list[dict[str, Any]]) -> CancellationGroupKpi:
        res_c = sum(1 for r in pool if r.get("status") == "resolved")
        open_c = sum(1 for r in pool if r.get("status") == "open_or_pending")
        canc_c = sum(1 for r in pool if r.get("status") == "cancelled")
        concl_c = res_c + canc_c
        return CancellationGroupKpi(
            key=ckey,
            total_count=len(pool),
            resolved_count=res_c,
            open_or_pending_count=open_c,
            cancelled_count=canc_c,
            concluded_count=concl_c,
            cancelled_pct_concluded=pct_dec(canc_c, concl_c),
            cancelled_pct_all=pct_dec(canc_c, len(pool)),
        )

    canc_all = make_cancellation_kpi("all", records)
    canc_core = make_cancellation_kpi("core", core)
    canc_by_sector_keys = sorted({str(r.get("sector") or "") for r in core if r.get("sector")})
    canc_by_sector: dict[str, CancellationGroupKpi] = {
        sk: make_cancellation_kpi(sk, [r for r in core if r.get("sector") == sk])
        for sk in canc_by_sector_keys
    }
    canc_sectors_sorted = sorted(
        canc_by_sector.values(),
        key=lambda c: (c.cancelled_pct_concluded, c.cancelled_count),
        reverse=True,
    )

    # 2026 quarterly dynamics & Spring 2026 KPO healthcare surge (H1 2026)
    quarter_defs = (
        ("2026-Q1", "2026-01-01", "2026-03-31"),
        ("2026-Q2", "2026-04-01", "2026-06-30"),
        ("2026-Q3", "2026-07-01", "2026-09-30"),
        ("2026-Q4", "2026-10-01", "2026-12-31"),
    )
    quarters_2026: dict[str, QuarterKpi] = {}
    for qkey, d_start, d_end in quarter_defs:
        qp = [r for r in core if isinstance(r.get("date"), str) and d_start <= r["date"] <= d_end]
        qhc = [r for r in qp if r.get("sector") == "Ochrona zdrowia"]
        qs = [r for r in qp if is_signed(r)]
        qsum = sum((to_dec(r["amountPln"]) for r in qs), Decimal("0"))
        qwb = [
            r
            for r in qs
            if isinstance(r.get("bids"), int) and not isinstance(r.get("bids"), bool)
        ]
        qsb = [r for r in qwb if r["bids"] == 1]
        qzr = [r for r in qs if r.get("bids") == 1 or r.get("bids") is None]
        quarters_2026[qkey] = QuarterKpi(
            quarter_key=qkey,
            start_date=d_start,
            end_date=d_end,
            proc_count=len(qp),
            hc_proc_count=len(qhc),
            signed_count=len(qs),
            sum_pln=qsum,
            with_bids_count=len(qwb),
            single_bid_count=len(qsb),
            single_bid_pct=pct_dec(len(qsb), len(qwb)),
            zero_rival_count=len(qzr),
            zero_rival_pct=pct_dec(len(qzr), len(qs)),
        )

    hc_core_all = [r for r in core if r.get("sector") == "Ochrona zdrowia"]
    hc_signed_all = [r for r in hc_core_all if is_signed(r)]
    hc_sum_all = sum((to_dec(r["amountPln"]) for r in hc_signed_all), Decimal("0"))

    hc_h1_proc = [
        r
        for r in hc_core_all
        if isinstance(r.get("date"), str) and "2026-01-01" <= r["date"] <= "2026-06-30"
    ]
    hc_h1_signed = [r for r in hc_h1_proc if is_signed(r)]
    hc_h1_sum = sum((to_dec(r["amountPln"]) for r in hc_h1_signed), Decimal("0"))
    hc_h1_zr = [r for r in hc_h1_signed if r.get("bids") == 1 or r.get("bids") is None]
    hc_h1_zr_sum = sum((to_dec(r["amountPln"]) for r in hc_h1_zr), Decimal("0"))

    hc_2026_h1 = {
        "hc_total_proc_count": len(hc_core_all),
        "hc_total_signed_count": len(hc_signed_all),
        "hc_total_sum_pln": hc_sum_all,
        "h1_proc_count": len(hc_h1_proc),
        "h1_proc_pct_of_hc": pct_dec(len(hc_h1_proc), len(hc_core_all)),
        "h1_signed_count": len(hc_h1_signed),
        "h1_signed_pct_of_hc": pct_dec(len(hc_h1_signed), len(hc_signed_all)),
        "h1_sum_pln": hc_h1_sum,
        "h1_spend_pct_of_hc": pct_dec(hc_h1_sum, hc_sum_all),
        "h1_zero_rival_count": len(hc_h1_zr),
        "h1_zero_rival_pct": pct_dec(len(hc_h1_zr), len(hc_h1_signed)),
        "h1_zero_rival_sum_pln": hc_h1_zr_sum,
        "h1_zero_rival_spend_pct": pct_dec(hc_h1_zr_sum, hc_h1_sum),
    }

    # EU co-financing among core signed contracts
    eu_signed = [r for r in core_signed if r.get("eu") is True]
    eu_sum = sum((to_dec(r["amountPln"]) for r in eu_signed), Decimal("0"))
    eu_signed_pct = pct_dec(len(eu_signed), len(core_signed))
    eu_spend_pct = pct_dec(eu_sum, core_sum)

    # Sectors in core
    sector_names = sorted({str(r.get("sector") or "") for r in core if r.get("sector")})
    sectors: list[GroupKpi] = []
    for sk in sector_names:
        sp = [r for r in core if r.get("sector") == sk]
        ss = [r for r in core_signed if r.get("sector") == sk]
        ssum = sum((to_dec(r["amountPln"]) for r in ss), Decimal("0"))
        sectors.append(
            GroupKpi(
                key=sk,
                proc_count=len(sp),
                proc_pct=pct_dec(len(sp), len(core)),
                signed_count=len(ss),
                sum_pln=ssum,
                spend_pct=pct_dec(ssum, core_sum),
            )
        )
    sectors.sort(key=lambda g: (g.sum_pln, g.proc_count), reverse=True)
    sectors_by_key = {g.key: g for g in sectors}

    uni_health_sum = (
        (sectors_by_key["Uczelnie i nauka"].sum_pln if "Uczelnie i nauka" in sectors_by_key else Decimal("0"))
        + (sectors_by_key["Ochrona zdrowia"].sum_pln if "Ochrona zdrowia" in sectors_by_key else Decimal("0"))
    )
    uni_health_signed = (
        (sectors_by_key["Uczelnie i nauka"].signed_count if "Uczelnie i nauka" in sectors_by_key else 0)
        + (sectors_by_key["Ochrona zdrowia"].signed_count if "Ochrona zdrowia" in sectors_by_key else 0)
    )
    uni_health_pct = pct_dec(uni_health_sum, core_sum)

    # Provinces in core
    prov_names = sorted({str(r.get("province") or "Inne") for r in core})
    provinces: list[GroupKpi] = []
    for pk in prov_names:
        pp = [r for r in core if (r.get("province") or "Inne") == pk]
        ps = [r for r in core_signed if (r.get("province") or "Inne") == pk]
        psum = sum((to_dec(r["amountPln"]) for r in ps), Decimal("0"))
        provinces.append(
            GroupKpi(
                key=pk,
                proc_count=len(pp),
                proc_pct=pct_dec(len(pp), len(core)),
                signed_count=len(ps),
                sum_pln=psum,
                spend_pct=pct_dec(psum, core_sum),
            )
        )
    provinces.sort(key=lambda g: (g.sum_pln, g.proc_count), reverse=True)
    provinces_by_key = {g.key: g for g in provinces}

    # Recurring contractors in core (grouped by canonical entity key)
    vendor_buckets: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"variants": Counter(), "amounts": [], "single": 0}
    )
    for r in core_signed:
        amt = to_dec(r["amountPln"])
        for raw_c in r.get("contractors") or []:
            if not isinstance(raw_c, str) or not raw_c.strip():
                continue
            ckey = canonical_vendor_entity_key(raw_c)
            vendor_buckets[ckey]["variants"][raw_c] += 1
            vendor_buckets[ckey]["amounts"].append(amt)
            if r.get("bids") == 1:
                vendor_buckets[ckey]["single"] += 1

    vendors_all: dict[str, VendorKpi] = {}
    recurring_vendors: list[VendorKpi] = []
    for ckey, info in vendor_buckets.items():
        # Prefer the most frequent variant (tie-break: mixed-case / shorter)
        variants_sorted = sorted(
            info["variants"].items(),
            key=lambda kv: (-kv[1], kv[0].isupper(), len(kv[0]), kv[0]),
        )
        display = variants_sorted[0][0]
        vkpi = VendorKpi(
            canon_key=ckey,
            display_name=display,
            raw_variants=tuple(sorted(info["variants"].keys())),
            signed_count=len(info["amounts"]),
            sum_pln=sum(info["amounts"], Decimal("0")),
            single_bid_count=info["single"],
        )
        vendors_all[ckey] = vkpi
        if vkpi.signed_count >= 2:
            recurring_vendors.append(vkpi)

    recurring_vendors.sort(key=lambda v: (v.signed_count, v.sum_pln), reverse=True)

    return {
        "all_count": len(records),
        "core_count": len(core),
        "incidental_count": len(incidental),
        "status_all": status_breakdown(records),
        "status_core": status_breakdown(core),
        "core_signed_count": len(core_signed),
        "core_sum_pln": core_sum,
        "core_median_pln": core_median,
        "incidental_signed_count": len(inc_signed),
        "incidental_sum_pln": inc_sum,
        "all_signed_count": len(core_signed) + len(inc_signed),
        "all_sum_pln": core_sum + inc_sum,
        "scope_stats": scope_stats,
        "categories": categories,
        "sw_hw": {
            "proc_count": sw_hw_proc,
            "proc_pct": sw_hw_proc_pct,
            "signed_count": sw_hw_signed,
            "sum_pln": sw_hw_sum,
            "spend_pct": sw_hw_spend_pct,
        },
        "notice_years": notice_years,
        "notice_mult_2026_2024": notice_mult_2026_2024,
        "contract_years": contract_years,
        "contract_mult_2026_2024": contract_mult_2026_2024,
        "competition": {
            "signed_count": len(core_signed),
            "with_bids_count": len(core_with_bids),
            "missing_bids_count": core_missing_bids,
            "competitive_sum_pln": competitive_sum,
            "competitive_spend_pct": pct_dec(competitive_sum, core_sum),
            "single_bid_count": len(core_single_bids),
            "single_bid_pct": core_single_bid_pct,
            "single_bid_sum_pln": comp_tiers["single_bid"].sum_pln,
            "single_bid_spend_pct_core": comp_tiers["single_bid"].spend_pct_core,
            "single_bid_spend_pct_comp": comp_tiers["single_bid"].spend_pct_comp,
            "sole_source_count": comp_tiers["sole_source"].signed_count,
            "sole_source_sum_pln": comp_tiers["sole_source"].sum_pln,
            "sole_source_spend_pct_core": comp_tiers["sole_source"].spend_pct_core,
            "zero_rival_count": comp_tiers["zero_rival"].signed_count,
            "zero_rival_count_pct_core": comp_tiers["zero_rival"].signed_pct_core,
            "zero_rival_sum_pln": comp_tiers["zero_rival"].sum_pln,
            "zero_rival_spend_pct": comp_tiers["zero_rival"].spend_pct_core,
            "bids_2_3_count": comp_tiers["bids_2_3"].signed_count,
            "bids_2_3_sum_pln": comp_tiers["bids_2_3"].sum_pln,
            "bids_2_3_spend_pct_core": comp_tiers["bids_2_3"].spend_pct_core,
            "bids_4_plus_count": comp_tiers["bids_4_plus"].signed_count,
            "bids_4_plus_count_pct_core": comp_tiers["bids_4_plus"].signed_pct_core,
            "bids_4_plus_sum_pln": comp_tiers["bids_4_plus"].sum_pln,
            "bids_4_plus_spend_pct_core": comp_tiers["bids_4_plus"].spend_pct_core,
            "median_bids": core_median_bids,
            "top_bids_records": top_bids_records,
            "tiers": comp_tiers,
            "software_zero_rival": sw_zero_rival,
            "cliff_170k": cliff_170k,
            "eu_vs_non_eu": eu_competition,
        },
        "eu": {
            "signed_count": len(eu_signed),
            "signed_pct": eu_signed_pct,
            "sum_pln": eu_sum,
            "spend_pct": eu_spend_pct,
        },
        "cancellations": {
            "all": canc_all,
            "core": canc_core,
            "by_sector": canc_by_sector,
            "sectors_sorted": canc_sectors_sorted,
        },
        "temporal": {
            "quarters_2026": quarters_2026,
            "hc_2026_h1": hc_2026_h1,
        },
        "sectors": sectors,
        "sectors_by_key": sectors_by_key,
        "uni_health": {
            "signed_count": uni_health_signed,
            "sum_pln": uni_health_sum,
            "spend_pct": uni_health_pct,
        },
        "provinces": provinces,
        "provinces_by_key": provinces_by_key,
        "vendors_all": vendors_all,
        "recurring_vendors": recurring_vendors,
    }


# ---------------------------------------------------------------------------
# Mode 1: --print-kpis
# ---------------------------------------------------------------------------


def print_kpis(kpis: dict[str, Any]) -> None:
    hr = "=" * 86
    sub_hr = "-" * 86

    print(hr)
    print(f"BZP AI REPORT (2024–2026) — WYLICZONE KPI (PL / EN) · snapshot {SNAPSHOT_DATE}")
    print(hr)

    # 1. Counts & Status distribution
    print("\n1. LICZBA POSTĘPOWAŃ I ROZKŁAD STATUSÓW (ALL vs CORE vs INCIDENTAL)")
    print(sub_hr)
    print(
        f"  Wszystkie postępowania (all):       {kpis['all_count']:>4d}\n"
        f"  Postępowania podstawowe (core):     {kpis['core_count']:>4d} "
        f"(PL: {fmt_pct(kpis['core_count'], kpis['all_count'], 'pl')} | "
        f"EN: {fmt_pct(kpis['core_count'], kpis['all_count'], 'en')})\n"
        f"  Postępowania poboczne (incidental): {kpis['incidental_count']:>4d} "
        f"(PL: {fmt_pct(kpis['incidental_count'], kpis['all_count'], 'pl')} | "
        f"EN: {fmt_pct(kpis['incidental_count'], kpis['all_count'], 'en')})"
    )

    for label, st in (("ALL (171)", kpis["status_all"]), ("CORE (podstawowe)", kpis["status_core"])):
        tot = st["total"]
        print(
            f"\n  Statusy — {label} [n={tot}]:\n"
            f"    resolved (podpisana umowa):  {st['resolved']:>3d}  "
            f"(PL: {fmt_pct(st['resolved'], tot, 'pl')} | EN: {fmt_pct(st['resolved'], tot, 'en')})\n"
            f"    open_or_pending (w toku):    {st['open_or_pending']:>3d}  "
            f"(PL: {fmt_pct(st['open_or_pending'], tot, 'pl')} | EN: {fmt_pct(st['open_or_pending'], tot, 'en')})\n"
            f"      ├─ open_for_bids (>= {SNAPSHOT_DATE}): {st['open_for_bids']:>3d}\n"
            f"      └─ pending_result (< {SNAPSHOT_DATE}):  {st['pending_result']:>3d}\n"
            f"    cancelled (unieważnione):    {st['cancelled']:>3d}  "
            f"(PL: {fmt_pct(st['cancelled'], tot, 'pl')} | EN: {fmt_pct(st['cancelled'], tot, 'en')})"
        )

    # 2. Signed contract totals & aiScope split
    print("\n2. WARTOŚĆ PODPISANYCH UMÓW (CORE, PURE vs MIXED, INCIDENTAL)")
    print(sub_hr)
    csum = kpis["core_sum_pln"]
    cmed = kpis["core_median_pln"]
    isum = kpis["incidental_sum_pln"]
    print(
        f"  Core podpisane umowy ({kpis['core_signed_count']}):\n"
        f"    Dokładnie: {fmt_exact_pln(csum, 'pl')}  |  {fmt_exact_pln(csum, 'en')}  "
        f"(zaokr.: {fmt_int_grouped(round_int(csum), 'pl')} zł)\n"
        f"    W mln:     PL: {fmt_mln(csum, 'pl')}  |  EN: {fmt_mln(csum, 'en')}\n"
        f"    Mediana:   PL: {fmt_exact_pln(cmed, 'pl')} ({fmt_k(cmed, 'pl', 1)})  |  "
        f"EN: {fmt_exact_pln(cmed, 'en')} ({fmt_k(cmed, 'en', 1)})"
    )
    for sc_key, sc_label in (
        ("pure", "aiScope == 'pure' (czyste AI)"),
        ("mixed", "aiScope == 'mixed' (szersze zamówienie z komponentem AI)"),
        ("missing", "aiScope nieustawione (brak pola)"),
    ):
        sc = kpis["scope_stats"][sc_key]
        if sc_key == "missing" and sc["proc_count"] == 0:
            continue
        print(
            f"  {sc_label}:\n"
            f"    Postępowania: {sc['proc_count']:>3d}  |  Umowy: {sc['signed_count']:>3d}\n"
            f"    Suma:         {fmt_exact_pln(sc['sum_pln'], 'pl')}  "
            f"(PL: {fmt_mln(sc['sum_pln'], 'pl')}, {fmt_num(sc['spend_pct'], 1, 'pl')}% | "
            f"EN: {fmt_mln(sc['sum_pln'], 'en')}, {fmt_num(sc['spend_pct'], 1, 'en')}%)"
        )
    print(
        f"  Incidental podpisane umowy ({kpis['incidental_signed_count']} z {kpis['incidental_count']} post.):\n"
        f"    Suma:      {fmt_exact_pln(isum, 'pl')}  |  {fmt_exact_pln(isum, 'en')}\n"
        f"    W mln:     PL: {fmt_mln(isum, 'pl')}  |  EN: {fmt_mln(isum, 'en')}\n"
        f"  Łącznie ALL ({kpis['all_signed_count']} umów): "
        f"PL: {fmt_mln(kpis['all_sum_pln'], 'pl')} ({fmt_exact_pln(kpis['all_sum_pln'], 'pl')})  |  "
        f"EN: {fmt_mln(kpis['all_sum_pln'], 'en')}"
    )

    # 3. 4 Core Categories + Software+Hardware combined
    print("\n3. CZTERY KATEGORIE PODSTAWOWE (CORE) + SOFTWARE & HARDWARE ŁĄCZNIE")
    print(sub_hr)
    for ck in CORE_CATEGORIES:
        cat: CategoryKpi = kpis["categories"][ck]
        med_bids_str = (
            str(int(cat.median_bids))
            if cat.median_bids == int(cat.median_bids)
            else fmt_num(cat.median_bids, 1, "en")
        )
        print(
            f"  [{ck}] {CAT_LABELS_PL[ck]} / {CAT_LABELS_EN[ck]}:\n"
            f"    Postępowania: {cat.proc_count:>3d} / {kpis['core_count']}  "
            f"(PL: {fmt_num(cat.proc_pct, 1, 'pl')}% | EN: {fmt_num(cat.proc_pct, 1, 'en')}%)\n"
            f"    Umowy:        {cat.signed_count:>3d}  |  Suma: {fmt_exact_pln(cat.sum_pln, 'pl')}  "
            f"(PL: {fmt_mln(cat.sum_pln, 'pl')}, {fmt_num(cat.spend_pct, 1, 'pl')}% | "
            f"EN: {fmt_mln(cat.sum_pln, 'en')}, {fmt_num(cat.spend_pct, 1, 'en')}%)\n"
            f"    Mediana PLN:  {fmt_exact_pln(cat.median_pln, 'pl')}  "
            f"(PL: {fmt_k(cat.median_pln, 'pl', 1)} / {fmt_k(cat.median_pln, 'pl', 0)} | "
            f"EN: {fmt_k(cat.median_pln, 'en', 1)} / {fmt_k(cat.median_pln, 'en', 0)})\n"
            f"    Oferty (bids): jawne={cat.with_bids_count}/{cat.signed_count}, "
            f"1 oferta={cat.single_bid_count}/{cat.with_bids_count} "
            f"(PL: {fmt_num(cat.single_bid_pct, 1, 'pl')}% | EN: {fmt_num(cat.single_bid_pct, 1, 'en')}%), "
            f"mediana bids={med_bids_str}"
        )

    sh = kpis["sw_hw"]
    print(
        f"\n  ŁĄCZNIE software_deploy + hardware_lab:\n"
        f"    Postępowania: {sh['proc_count']} / {kpis['core_count']}  "
        f"(PL: {fmt_num(sh['proc_pct'], 1, 'pl')}% | EN: {fmt_num(sh['proc_pct'], 1, 'en')}%)\n"
        f"    Umowy:        {sh['signed_count']} / {kpis['core_signed_count']}\n"
        f"    Suma:         {fmt_exact_pln(sh['sum_pln'], 'pl')}  "
        f"(PL: {fmt_mln(sh['sum_pln'], 'pl')}, {fmt_num(sh['spend_pct'], 1, 'pl')}% | "
        f"EN: {fmt_mln(sh['sum_pln'], 'en')}, {fmt_num(sh['spend_pct'], 1, 'en')}%)"
    )

    # 4. Annual dynamics in two views
    print("\n4. DYNAMIKA ROCZNA UMÓW PODSTAWOWYCH (2 UJĘCIA)")
    print(sub_hr)
    print("  a) Wg roku ogłoszenia w BZP (`year`: 2024, 2025, 2026):")
    for y, ykpi in kpis["notice_years"].items():
        print(
            f"    {y}: {ykpi.proc_count:>2d} post. | {ykpi.signed_count:>2d} umów | "
            f"{fmt_exact_pln(ykpi.sum_pln, 'pl'):>17s} | "
            f"PL: {fmt_mln(ykpi.sum_pln, 'pl'):>13s} | EN: {fmt_mln(ykpi.sum_pln, 'en'):>10s}"
        )
    nm = kpis["notice_mult_2026_2024"]
    print(
        f"    Mnożnik 2026 / 2024 (wg roku ogłoszenia): "
        f"PL: {fmt_num(nm, 1, 'pl')}× ({fmt_num(nm, 2, 'pl')}×) | "
        f"EN: {fmt_num(nm, 1, 'en')}× ({fmt_num(nm, 2, 'en')}×)"
    )

    print("\n  b) Wg roku zawarcia umowy (`contractDate[:4]`: 2023, 2024, 2025, 2026):")
    for cy, ykpi in kpis["contract_years"].items():
        print(
            f"    {cy}: {ykpi.signed_count:>2d} umów | "
            f"{fmt_exact_pln(ykpi.sum_pln, 'pl'):>17s} | "
            f"PL: {fmt_mln(ykpi.sum_pln, 'pl'):>13s} | EN: {fmt_mln(ykpi.sum_pln, 'en'):>10s}"
        )
    cm = kpis["contract_mult_2026_2024"]
    print(
        f"    Mnożnik 2026 / 2024 (wg roku zawarcia umowy): "
        f"PL: {fmt_num(cm, 1, 'pl')}× ({fmt_num(cm, 2, 'pl')}×) | "
        f"EN: {fmt_num(cm, 1, 'en')}× ({fmt_num(cm, 2, 'en')}×)"
    )

    # 5. Competition overall in core
    print("\n5. KONKURENCJA OGÓŁEM W CORE (ROZKŁAD KWOTOWY, PRÓG 170 TYS. ZŁ, UE vs POZA UE)")
    print(sub_hr)
    comp = kpis["competition"]
    tiers: dict[str, CompetitionTierKpi] = comp["tiers"]
    sw_zr = comp["software_zero_rival"]
    cliff: dict[str, CompetitionSliceKpi] = comp["cliff_170k"]
    eu_comp: dict[str, CompetitionSliceKpi] = comp["eu_vs_non_eu"]

    print(
        f"  Umowy z jawną l. ofert (`bids`): {comp['with_bids_count']} z {comp['signed_count']} "
        f"(brak `bids` / z wolnej ręki: {comp['missing_bids_count']})\n"
        f"  Kwota umów konkurencyjnych:      {fmt_exact_pln(comp['competitive_sum_pln'], 'pl')}  "
        f"(PL: {fmt_mln(comp['competitive_sum_pln'], 'pl')}, {fmt_num(comp['competitive_spend_pct'], 1, 'pl')}% core | "
        f"EN: {fmt_mln(comp['competitive_sum_pln'], 'en')}, {fmt_num(comp['competitive_spend_pct'], 1, 'en')}% core)\n"
        f"  Umowy z 1 ofertą (`bids == 1`):  {comp['single_bid_count']} z {comp['with_bids_count']}  "
        f"(PL: {fmt_num(comp['single_bid_pct'], 1, 'pl')}% | EN: {fmt_num(comp['single_bid_pct'], 1, 'en')}%)\n"
        f"  Mediana liczby ofert w core:     {comp['median_bids']}"
    )

    print(
        f"\n  a) Koszyki kwotowe konkurencji we wszystkich podpisanych umowach core "
        f"[n={comp['signed_count']}, {fmt_exact_pln(kpis['core_sum_pln'], 'pl')}]:"
    )
    sb_t = tiers["single_bid"]
    ss_t = tiers["sole_source"]
    zr_t = tiers["zero_rival"]
    b23_t = tiers["bids_2_3"]
    b4p_t = tiers["bids_4_plus"]
    print(
        f"    single_bid (`bids == 1`):              {sb_t.signed_count:>2d} umów "
        f"(PL: {fmt_num(sb_t.signed_pct_core, 1, 'pl')}% ze {comp['signed_count']}, "
        f"{fmt_num(sb_t.signed_pct_comp, 1, 'pl')}% ze {comp['with_bids_count']}) | "
        f"{fmt_exact_pln(sb_t.sum_pln, 'pl'):>16s} | "
        f"PL: {fmt_mln(sb_t.sum_pln, 'pl')} ({fmt_num(sb_t.spend_pct_core, 1, 'pl')}% core, "
        f"{fmt_num(sb_t.spend_pct_comp, 1, 'pl')}% konkur.) | "
        f"EN: {fmt_mln(sb_t.sum_pln, 'en')} ({fmt_num(sb_t.spend_pct_core, 1, 'en')}% core, "
        f"{fmt_num(sb_t.spend_pct_comp, 1, 'en')}% comp.)\n"
        f"    sole_source (`bids is None`):          {ss_t.signed_count:>2d} umów "
        f"(PL: {fmt_num(ss_t.signed_pct_core, 1, 'pl')}% ze {comp['signed_count']}) | "
        f"{fmt_exact_pln(ss_t.sum_pln, 'pl'):>16s} | "
        f"PL: {fmt_mln(ss_t.sum_pln, 'pl')} ({fmt_num(ss_t.spend_pct_core, 1, 'pl')}% core) | "
        f"EN: {fmt_mln(ss_t.sum_pln, 'en')} ({fmt_num(ss_t.spend_pct_core, 1, 'en')}% core)\n"
        f"    zero_rival (`bids == 1 or None`):      {zr_t.signed_count:>2d} umów "
        f"(PL: {fmt_num(zr_t.signed_pct_core, 1, 'pl')}% | EN: {fmt_num(zr_t.signed_pct_core, 1, 'en')}%) | "
        f"{fmt_exact_pln(zr_t.sum_pln, 'pl'):>16s} | "
        f"PL: {fmt_mln(zr_t.sum_pln, 'pl')} ({fmt_num(zr_t.spend_pct_core, 1, 'pl')}% core) | "
        f"EN: {fmt_mln(zr_t.sum_pln, 'en')} ({fmt_num(zr_t.spend_pct_core, 1, 'en')}% core)\n"
        f"    bids_2_3 (`2 <= bids <= 3`):           {b23_t.signed_count:>2d} umów "
        f"(PL: {fmt_num(b23_t.signed_pct_core, 1, 'pl')}% | EN: {fmt_num(b23_t.signed_pct_core, 1, 'en')}%) | "
        f"{fmt_exact_pln(b23_t.sum_pln, 'pl'):>16s} | "
        f"PL: {fmt_mln(b23_t.sum_pln, 'pl')} ({fmt_num(b23_t.spend_pct_core, 1, 'pl')}% core) | "
        f"EN: {fmt_mln(b23_t.sum_pln, 'en')} ({fmt_num(b23_t.spend_pct_core, 1, 'en')}% core)\n"
        f"    bids_4_plus (`bids >= 4`):             {b4p_t.signed_count:>2d} umów "
        f"(PL: {fmt_num(b4p_t.signed_pct_core, 1, 'pl')}% | EN: {fmt_num(b4p_t.signed_pct_core, 1, 'en')}%) | "
        f"{fmt_exact_pln(b4p_t.sum_pln, 'pl'):>16s} | "
        f"PL: {fmt_mln(b4p_t.sum_pln, 'pl')} ({fmt_num(b4p_t.spend_pct_core, 1, 'pl')}% core) | "
        f"EN: {fmt_mln(b4p_t.sum_pln, 'en')} ({fmt_num(b4p_t.spend_pct_core, 1, 'en')}% core)\n"
        f"    -> W `software_deploy` [n={sw_zr['signed_count']}, {fmt_exact_pln(sw_zr['sum_pln'], 'pl')}]: "
        f"zero_rival = {sw_zr['zero_rival_count']}/{sw_zr['signed_count']} "
        f"(PL: {fmt_num(sw_zr['zero_rival_count_pct'], 1, 'pl')}% | "
        f"EN: {fmt_num(sw_zr['zero_rival_count_pct'], 1, 'en')}%; "
        f"1 oferta={sw_zr['single_bid_count']} + wolna ręka={sw_zr['sole_source_count']}) | "
        f"{fmt_exact_pln(sw_zr['zero_rival_sum_pln'], 'pl')} "
        f"(PL: {fmt_mln(sw_zr['zero_rival_sum_pln'], 'pl')}, {fmt_num(sw_zr['zero_rival_spend_pct'], 1, 'pl')}% software | "
        f"EN: {fmt_mln(sw_zr['zero_rival_sum_pln'], 'en')}, {fmt_num(sw_zr['zero_rival_spend_pct'], 1, 'en')}% software)"
    )

    print(
        f"\n  b) Klif konkurencji 170 000 zł wśród konkurencyjnych umów core [n={comp['with_bids_count']}]:"
    )
    for cl_key, cl_label in (
        ("below_170k", "below_170k (`amountPln < 170 000 zł`)"),
        ("at_or_above_170k", "at_or_above_170k (`amountPln >= 170 000 zł`)"),
    ):
        cs = cliff[cl_key]
        med_pl = str(int(cs.median_bids)) if cs.median_bids == int(cs.median_bids) else fmt_num(cs.median_bids, 1, "pl")
        med_en = str(int(cs.median_bids)) if cs.median_bids == int(cs.median_bids) else fmt_num(cs.median_bids, 1, "en")
        print(
            f"    {cl_label:<44s} | {cs.with_bids_count:>2d}/{comp['with_bids_count']} "
            f"(PL: {fmt_num(cs.count_pct_comp, 1, 'pl')}% | EN: {fmt_num(cs.count_pct_comp, 1, 'en')}%) | "
            f"{fmt_exact_pln(cs.sum_pln, 'pl'):>16s} "
            f"(PL: {fmt_mln(cs.sum_pln, 'pl')}, {fmt_num(cs.spend_pct_comp, 1, 'pl')}% konkur. | "
            f"EN: {fmt_mln(cs.sum_pln, 'en')}, {fmt_num(cs.spend_pct_comp, 1, 'en')}% comp.) | "
            f"mediana bids PL: {med_pl} / EN: {med_en} (1,0: {fmt_num(cs.median_bids, 1, 'pl')}/{fmt_num(cs.median_bids, 1, 'en')}) | "
            f"1 oferta: {cs.single_bid_count}/{cs.with_bids_count} "
            f"(PL: {fmt_num(cs.single_bid_pct, 1, 'pl')}% | EN: {fmt_num(cs.single_bid_pct, 1, 'en')}%)"
        )

    print(
        f"\n  c) Odsetek 1 oferty wg współfinansowania UE wśród konkurencyjnych umów core [n={comp['with_bids_count']}]:"
    )
    for ek, elabel in (
        ("eu", "UE (`eu == True`)"),
        ("non_eu", "Poza UE (`eu != True`)"),
    ):
        es = eu_comp[ek]
        print(
            f"    {elabel:<26s} | 1 oferta: {es.single_bid_count:>2d}/{es.with_bids_count:<2d} "
            f"(PL: {fmt_num(es.single_bid_pct, 1, 'pl')}% | EN: {fmt_num(es.single_bid_pct, 1, 'en')}%) | "
            f"mediana bids: {es.median_bids} | suma: {fmt_exact_pln(es.sum_pln, 'pl')} "
            f"(PL: {fmt_mln(es.sum_pln, 'pl')} | EN: {fmt_mln(es.sum_pln, 'en')})"
        )

    print("\n  d) Rekordy o najwyższej liczbie ofert (top 6 w core):")
    for rec in comp["top_bids_records"][:6]:
        amt_d = to_dec(rec["amountPln"])
        print(
            f"    {rec['bids']:>2d} ofert | {rec['bzp']} | "
            f"{fmt_exact_pln(amt_d, 'pl'):>14s} | {rec['category']:<15s} | {rec['org']}"
        )

    # 6. Quarterly dynamics, H1 2026 healthcare surge & cancellations
    print("\n6. DYNAMIKA KWARTALNA, FALA SZPITALNA H1 2026 I UNIEWAŻNIENIA")
    print(sub_hr)
    canc = kpis["cancellations"]
    c_core: CancellationGroupKpi = canc["core"]
    c_all: CancellationGroupKpi = canc["all"]
    print(
        f"  a) Wskaźniki unieważnień (wobec zakończonych `resolved + cancelled` oraz wobec wszystkich):\n"
        f"    CORE: {c_core.cancelled_count} / {c_core.concluded_count} zakończonych "
        f"(PL: {fmt_num(c_core.cancelled_pct_concluded, 1, 'pl')}% | "
        f"EN: {fmt_num(c_core.cancelled_pct_concluded, 1, 'en')}%)  |  "
        f"{c_core.cancelled_count} / {c_core.total_count} wszystkich core "
        f"(PL: {fmt_num(c_core.cancelled_pct_all, 1, 'pl')}% | EN: {fmt_num(c_core.cancelled_pct_all, 1, 'en')}%)\n"
        f"    ALL:  {c_all.cancelled_count} / {c_all.concluded_count} zakończonych "
        f"(PL: {fmt_num(c_all.cancelled_pct_concluded, 1, 'pl')}% | "
        f"EN: {fmt_num(c_all.cancelled_pct_concluded, 1, 'en')}%)  |  "
        f"{c_all.cancelled_count} / {c_all.total_count} wszystkich "
        f"(PL: {fmt_num(c_all.cancelled_pct_all, 1, 'pl')}% | EN: {fmt_num(c_all.cancelled_pct_all, 1, 'en')}%)"
    )
    print("    Wg sektora (core):")
    for sc_sec in canc["sectors_sorted"]:
        print(
            f"      {sc_sec.key:<35s} | unieważnione: {sc_sec.cancelled_count:>2d}/{sc_sec.concluded_count:<2d} zakończ. "
            f"(PL: {fmt_num(sc_sec.cancelled_pct_concluded, 1, 'pl'):>5s}% | "
            f"EN: {fmt_num(sc_sec.cancelled_pct_concluded, 1, 'en'):>5s}%) | "
            f"{sc_sec.cancelled_count:>2d}/{sc_sec.total_count:<2d} ogółem "
            f"(PL: {fmt_num(sc_sec.cancelled_pct_all, 1, 'pl'):>5s}% | "
            f"EN: {fmt_num(sc_sec.cancelled_pct_all, 1, 'en'):>5s}%)"
        )

    temp = kpis["temporal"]
    hc_h1 = temp["hc_2026_h1"]
    print(
        f"\n  b) Fala szpitalna KPO wiosną 2026 r. (`2026 H1`: 2026-01-01..2026-06-30, sektor `Ochrona zdrowia`):\n"
        f"    Postępowania szpitalne w H1 2026: {hc_h1['h1_proc_count']} / {hc_h1['hc_total_proc_count']} "
        f"(PL: {fmt_num(hc_h1['h1_proc_pct_of_hc'], 1, 'pl')}% | "
        f"EN: {fmt_num(hc_h1['h1_proc_pct_of_hc'], 1, 'en')}%)\n"
        f"    Podpisane umowy szpitalne w H1 2026: {hc_h1['h1_signed_count']} / {hc_h1['hc_total_signed_count']} | "
        f"{fmt_exact_pln(hc_h1['h1_sum_pln'], 'pl')} z {fmt_exact_pln(hc_h1['hc_total_sum_pln'], 'pl')} "
        f"(PL: {fmt_mln(hc_h1['h1_sum_pln'], 'pl')}, {fmt_num(hc_h1['h1_spend_pct_of_hc'], 1, 'pl')}% wydatków szpit. | "
        f"EN: {fmt_mln(hc_h1['h1_sum_pln'], 'en')}, {fmt_num(hc_h1['h1_spend_pct_of_hc'], 1, 'en')}%)\n"
        f"    Bez konkurenta (`zero_rival` w H1 2026 szpitale): "
        f"{hc_h1['h1_zero_rival_count']} / {hc_h1['h1_signed_count']} "
        f"(PL: {fmt_num(hc_h1['h1_zero_rival_pct'], 1, 'pl')}% | "
        f"EN: {fmt_num(hc_h1['h1_zero_rival_pct'], 1, 'en')}%) | "
        f"{fmt_exact_pln(hc_h1['h1_zero_rival_sum_pln'], 'pl')} "
        f"(PL: {fmt_mln(hc_h1['h1_zero_rival_sum_pln'], 'pl')} | EN: {fmt_mln(hc_h1['h1_zero_rival_sum_pln'], 'en')})"
    )

    print("\n  c) Dynamika kwartalna 2026 r. w core (`2026-Q1` .. `2026-Q4` do 03.11):")
    for qk, qkpi in temp["quarters_2026"].items():
        print(
            f"    {qk} ({qkpi.start_date}..{qkpi.end_date}): "
            f"{qkpi.proc_count:>2d} post. (szpitale: {qkpi.hc_proc_count:>2d}) | "
            f"{qkpi.signed_count:>2d} umów ({fmt_exact_pln(qkpi.sum_pln, 'pl'):>16s}) | "
            f"1 oferta: {qkpi.single_bid_count:>2d}/{qkpi.with_bids_count:<2d} "
            f"(PL: {fmt_num(qkpi.single_bid_pct, 1, 'pl'):>5s}% | EN: {fmt_num(qkpi.single_bid_pct, 1, 'en'):>5s}%) | "
            f"zero_rival: {qkpi.zero_rival_count:>2d}/{qkpi.signed_count:<2d}"
        )

    # 7. EU co-financing
    print("\n7. WSPÓŁFINANSOWANIE UE / KPO / FERS (`eu == True` WŚRÓD UMÓW CORE)")
    print(sub_hr)
    eu = kpis["eu"]
    print(
        f"  Liczba umów z UE: {eu['signed_count']} z {kpis['core_signed_count']}  "
        f"(PL: {fmt_num(eu['signed_pct'], 1, 'pl')}% | EN: {fmt_num(eu['signed_pct'], 1, 'en')}%)\n"
        f"  Kwota umów z UE:  {fmt_exact_pln(eu['sum_pln'], 'pl')}  "
        f"(PL: {fmt_mln(eu['sum_pln'], 'pl')} | EN: {fmt_mln(eu['sum_pln'], 'en')})\n"
        f"  Udział w budżecie core: PL: {fmt_num(eu['spend_pct'], 1, 'pl')}% | "
        f"EN: {fmt_num(eu['spend_pct'], 1, 'en')}%"
    )

    # 8. Sectors & Top 6 Voivodeships
    print("\n8. SEKTORY ORAZ TOP 6 WOJEWÓDZTW (CORE)")
    print(sub_hr)
    print("  Sektory:")
    for sec in kpis["sectors"]:
        print(
            f"    {sec.key:<35s} | {sec.proc_count:>2d} post. ({fmt_num(sec.proc_pct, 1, 'pl'):>5s}%) | "
            f"{sec.signed_count:>2d} umów | PL: {fmt_mln(sec.sum_pln, 'pl'):>13s} "
            f"({fmt_num(sec.spend_pct, 1, 'pl'):>5s}%) | EN: {fmt_mln(sec.sum_pln, 'en'):>10s} "
            f"({fmt_num(sec.spend_pct, 1, 'en'):>5s}%)"
        )
    uh = kpis["uni_health"]
    print(
        f"  -> ŁĄCZNIE Uczelnie i nauka + Ochrona zdrowia: {uh['signed_count']} umów | "
        f"{fmt_exact_pln(uh['sum_pln'], 'pl')} | "
        f"PL: {fmt_mln(uh['sum_pln'], 'pl')} ({fmt_num(uh['spend_pct'], 1, 'pl')}%) | "
        f"EN: {fmt_mln(uh['sum_pln'], 'en')} ({fmt_num(uh['spend_pct'], 1, 'en')}%)"
    )

    print("\n  Top 6 województw wg wartości podpisanych umów core:")
    for idx, prov in enumerate(kpis["provinces"][:6], start=1):
        marker = " <-- [Mazowieckie / Śląskie]" if prov.key in {"Mazowieckie", "Śląskie"} else ""
        print(
            f"    {idx}. {prov.key:<22s} | {prov.proc_count:>2d} post. | {prov.signed_count:>2d} umów | "
            f"{fmt_exact_pln(prov.sum_pln, 'pl'):>16s} | "
            f"PL: {fmt_mln(prov.sum_pln, 'pl'):>12s} ({fmt_num(prov.spend_pct, 1, 'pl'):>5s}%) | "
            f"EN: {fmt_mln(prov.sum_pln, 'en'):>9s}{marker}"
        )

    # 9. Recurring vendors in core
    print("\n9. POWTARZAJĄCY SIĘ WYKONAWCY W CORE (UMOWY >= 2)")
    print(sub_hr)
    for v in kpis["recurring_vendors"]:
        variants_note = (
            f"  [UWAGA warianty: {list(v.raw_variants)}]" if len(v.raw_variants) > 1 else ""
        )
        print(
            f"  {v.signed_count} umów | {fmt_exact_pln(v.sum_pln, 'pl'):>15s} "
            f"(zaokr.: {fmt_int_grouped(round_int(v.sum_pln), 'pl'):>9s} zł / "
            f"{fmt_int_grouped(round_int(v.sum_pln), 'en'):>9s} PLN | "
            f"PL: {fmt_mln(v.sum_pln, 'pl')} | EN: {fmt_mln(v.sum_pln, 'en')}) | "
            f"1-ofertowe: {v.single_bid_count} | {v.display_name}{variants_note}"
        )

    # 10. Forensic HTML protocol benchmarks (159 core proceedings)
    fb = FORENSIC_HTML_BENCHMARKS
    print("\n10. WSKAŹNIKI FORENSIC Z AUDYTU KART HTML OGŁOSZEŃ BZP (159 POSTĘPOWAŃ CORE)")
    print(sub_hr)
    print(
        f"  Efektywny brak rywala (po odrzuceniach ofert {fmt_num(fb['bid_rejection_rate_pct'], 1, 'pl')}% "
        f"+ {fb['statutory_sole_source_contracts']} z wolnej ręki na "
        f"{fmt_num(fb['statutory_sole_source_sum_mln'], 2, 'pl')} mln zł):\n"
        f"    {fb['effective_zero_rival_contracts']} z {kpis['core_signed_count']} umów | "
        f"PL: {fmt_num(fb['effective_zero_rival_sum_mln'], 2, 'pl')} mln zł "
        f"({fmt_num(fb['effective_zero_rival_spend_pct'], 1, 'pl')}%) | "
        f"EN: {fmt_num(fb['effective_zero_rival_sum_mln'], 2, 'en')}M PLN "
        f"({fmt_num(fb['effective_zero_rival_spend_pct'], 1, 'en')}%)\n"
        f"  Brak merytorycznych kryteriów jakości: software "
        f"PL {fmt_num(fb['zero_quality_criteria_software_pct'], 1, 'pl')}% / "
        f"EN {fmt_num(fb['zero_quality_criteria_software_pct'], 1, 'en')}% | "
        f"ogółem PL {fmt_num(fb['zero_quality_criteria_overall_pct'], 1, 'pl')}% / "
        f"EN {fmt_num(fb['zero_quality_criteria_overall_pct'], 1, 'en')}%\n"
        f"  Kompresja ceny vs szacunek: tłok ofertowy "
        f"PL {fmt_num(fb['price_vs_estimate_crowded_pct'], 1, 'pl')}% "
        f"(-{fmt_num(fb['price_discount_crowded_pct'], 1, 'pl')}%) vs "
        f"{fmt_num(fb['price_vs_estimate_zero_rival_pct'], 1, 'pl')}% bez rywala\n"
        f"  Unieważnienia: w {fb['cancelled_with_bids_count']} z {c_core.cancelled_count} złożono co najmniej "
        f"{fb['cancelled_min_bids']} oferty (EN: at least {fb['cancelled_min_bids']} bids); "
        f"przekroczenie budżetu (art. 255 pkt 3 Pzp): {fb['cancelled_budget_shock_count']} z {c_core.cancelled_count} "
        f"(PL: {fmt_num(fb['cancelled_budget_shock_pct'], 1, 'pl')}% | "
        f"EN: {fmt_num(fb['cancelled_budget_shock_pct'], 1, 'en')}%)\n"
        f"  Udział MŚP (SME): PL {fmt_num(fb['sme_spend_pct'], 1, 'pl')}% kwoty "
        f"({fmt_num(fb['sme_contracts_pct'], 1, 'pl')}% umów) | "
        f"EN {fmt_num(fb['sme_spend_pct'], 1, 'en')}% of spend "
        f"({fmt_num(fb['sme_contracts_pct'], 1, 'en')}% of contracts)"
    )
    print(hr)


# ---------------------------------------------------------------------------
# Lightweight DOM Tree Parser (stdlib html.parser)
# ---------------------------------------------------------------------------


@dataclass
class HtmlNode:
    tag: str
    attrs: dict[str, str]
    line: int
    children: list[HtmlNode | str]

    @property
    def classes(self) -> set[str]:
        raw = self.attrs.get("class", "")
        return {c for c in raw.split() if c}

    def text(self, sep: str = "") -> str:
        parts: list[str] = []
        for ch in self.children:
            if isinstance(ch, str):
                parts.append(ch)
            else:
                parts.append(ch.text(sep=sep))
        return sep.join(parts)

    def spaced_text(self) -> str:
        raw = self.text(sep=" ")
        return re.sub(r"\s+", " ", raw).strip()

    def iter_elements(self) -> list[HtmlNode]:
        out: list[HtmlNode] = []
        for ch in self.children:
            if isinstance(ch, HtmlNode):
                out.append(ch)
                out.extend(ch.iter_elements())
        return out

    def find_all(
        self,
        tag: str | None = None,
        cls: str | None = None,
        attr_id: str | None = None,
    ) -> list[HtmlNode]:
        res: list[HtmlNode] = []
        for el in self.iter_elements():
            if tag is not None and el.tag != tag:
                continue
            if cls is not None and cls not in el.classes:
                continue
            if attr_id is not None and el.attrs.get("id") != attr_id:
                continue
            res.append(el)
        return res

    def find_one(
        self,
        tag: str | None = None,
        cls: str | None = None,
        attr_id: str | None = None,
    ) -> HtmlNode | None:
        matches = self.find_all(tag=tag, cls=cls, attr_id=attr_id)
        return matches[0] if matches else None


class DomTreeBuilder(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = HtmlNode(tag="#document", attrs={}, line=1, children=[])
        self._stack: list[HtmlNode] = [self.root]
        self.id_occurrences: list[tuple[str, int]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        t = tag.lower()
        attr_map = {k.lower(): (v if v is not None else "") for k, v in attrs}
        line = self.getpos()[0]
        if "id" in attr_map and attr_map["id"]:
            self.id_occurrences.append((attr_map["id"], line))
        node = HtmlNode(tag=t, attrs=attr_map, line=line, children=[])
        self._stack[-1].children.append(node)
        if t not in VOID_HTML_TAGS:
            self._stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        t = tag.lower()
        attr_map = {k.lower(): (v if v is not None else "") for k, v in attrs}
        line = self.getpos()[0]
        if "id" in attr_map and attr_map["id"]:
            self.id_occurrences.append((attr_map["id"], line))
        node = HtmlNode(tag=t, attrs=attr_map, line=line, children=[])
        self._stack[-1].children.append(node)

    def handle_endtag(self, tag: str) -> None:
        t = tag.lower()
        if t in VOID_HTML_TAGS:
            return
        for idx in range(len(self._stack) - 1, 0, -1):
            if self._stack[idx].tag == t:
                del self._stack[idx:]
                break

    def handle_data(self, data: str) -> None:
        if data:
            self._stack[-1].children.append(data)


def parse_html_file(path: Path) -> tuple[HtmlNode, list[tuple[str, int]]]:
    builder = DomTreeBuilder()
    builder.feed(path.read_text(encoding="utf-8"))
    builder.close()
    return builder.root, builder.id_occurrences


# ---------------------------------------------------------------------------
# Section A: JSON Schema, Logic & String Hygiene (#31)
# ---------------------------------------------------------------------------


def _walk_strings_and_numbers(
    obj: Any,
    path_prefix: str,
    rec_label: str,
    errors: list[str],
) -> None:
    if isinstance(obj, str):
        if "\n" in obj or "\r" in obj:
            errors.append(
                f"[JSON higiena] {rec_label} pole `{path_prefix}` zawiera niedozwolony znak nowej linii (\\n lub \\r)."
            )
    elif isinstance(obj, (int, float)) and not isinstance(obj, bool):
        if obj < 0:
            errors.append(
                f"[JSON logika] {rec_label} pole `{path_prefix}` ma wartość ujemną: {obj}."
            )
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            _walk_strings_and_numbers(item, f"{path_prefix}[{i}]", rec_label, errors)
    elif isinstance(obj, dict):
        for k, v in obj.items():
            sub_path = f"{path_prefix}.{k}" if path_prefix else str(k)
            _walk_strings_and_numbers(v, sub_path, rec_label, errors)


def has_balanced_parens(text: str) -> bool:
    depth = 0
    for ch in text:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth < 0:
                return False
    return depth == 0


def validate_json_dataset(records: Any, errors: list[str]) -> list[dict[str, Any]]:
    if not isinstance(records, list) or len(records) == 0:
        errors.append("[JSON schemat] Plik JSON musi zawierać niepustą tablicę rekordów.")
        return []

    seen_ids: set[str] = set()
    contractor_norm_map: dict[str, set[str]] = defaultdict(set)
    valid_records: list[dict[str, Any]] = []

    for idx, r in enumerate(records):
        if not isinstance(r, dict):
            errors.append(f"[JSON schemat] Rekord #{idx} nie jest obiektem JSON.")
            continue
        valid_records.append(r)

        rec_label = str(r.get("bzp") or r.get("id") or f"index={idx}")

        # 1. Required keys & non-empty values
        missing_keys = [k for k in REQUIRED_KEYS if k not in r or r[k] is None]
        if missing_keys:
            errors.append(f"[JSON schemat] {rec_label}: brak wymaganych kluczy: {missing_keys}.")
            continue

        for str_key in ("id", "bzp", "status", "date", "title", "org", "sector", "category", "url"):
            if not isinstance(r[str_key], str) or not r[str_key].strip():
                errors.append(
                    f"[JSON schemat] {rec_label}: pole `{str_key}` musi być niepustym stringiem."
                )

        rec_id = r["id"]
        if isinstance(rec_id, str):
            if rec_id in seen_ids:
                errors.append(f"[JSON schemat] Duplikat `id`: {rec_id!r} ({rec_label}).")
            seen_ids.add(rec_id)

        # 2. Allowed status, category, aiScope & subStatus
        status = r["status"]
        category = r["category"]
        if status not in ALLOWED_STATUSES:
            errors.append(
                f"[JSON schemat] {rec_label}: niedozwolony `status`={status!r} (dozwolone: {sorted(ALLOWED_STATUSES)})."
            )
        if category not in ALLOWED_CATEGORIES:
            errors.append(
                f"[JSON schemat] {rec_label}: niedozwolona `category`={category!r} (dozwolone: {sorted(ALLOWED_CATEGORIES)})."
            )

        ai_scope = r.get("aiScope")
        if ai_scope not in ALLOWED_AI_SCOPES:
            errors.append(
                f"[JSON schemat] {rec_label}: brak lub nieprawidłowe pole `aiScope`={ai_scope!r} "
                f"(dozwolone: {sorted(ALLOWED_AI_SCOPES)})."
            )
        else:
            if (category == "incidental") != (ai_scope == "incidental"):
                errors.append(
                    f"[JSON logika] {rec_label}: niespójność `category`={category!r} vs `aiScope`={ai_scope!r} "
                    f"(wymagane: category == 'incidental' <=> aiScope == 'incidental')."
                )

        deadline = r.get("deadline")
        if deadline is not None and not is_valid_iso_date(deadline):
            errors.append(
                f"[JSON logika] {rec_label}: nieprawidłowy format `deadline`={deadline!r} (wymagane YYYY-MM-DD)."
            )

        sub_status = r.get("subStatus")
        if status == "open_or_pending":
            expected_sub = (
                "open_for_bids"
                if isinstance(deadline, str) and deadline >= SNAPSHOT_DATE
                else "pending_result"
            )
            if sub_status not in ALLOWED_SUB_STATUSES:
                errors.append(
                    f"[JSON schemat] {rec_label}: brak lub nieprawidłowe `subStatus`={sub_status!r} dla `open_or_pending` "
                    f"(oczekiwane: {expected_sub!r})."
                )
            elif sub_status != expected_sub:
                errors.append(
                    f"[JSON logika] {rec_label}: `subStatus`={sub_status!r} niezgodne z `deadline`={deadline!r} "
                    f"względem {SNAPSHOT_DATE!r} (oczekiwane: {expected_sub!r})."
                )
        else:
            if sub_status in ALLOWED_SUB_STATUSES:
                errors.append(
                    f"[JSON logika] {rec_label}: pole `subStatus`={sub_status!r} niedozwolone dla statusu {status!r}."
                )

        # 3. Financial & date logic
        pub_date = r["date"]
        if not is_valid_iso_date(pub_date):
            errors.append(
                f"[JSON logika] {rec_label}: `date`={pub_date!r} nie jest poprawną datą YYYY-MM-DD."
            )
        else:
            yr = r["year"]
            if not isinstance(yr, int) or isinstance(yr, bool) or yr != int(pub_date[:4]):
                errors.append(
                    f"[JSON logika] {rec_label}: `year`={yr!r} niezgodne z `int(date[:4])`={int(pub_date[:4])}."
                )

        amt = r.get("amountPln")
        cdate = r.get("contractDate")
        contractors = r.get("contractors")

        if status == "resolved":
            if not isinstance(amt, (int, float)) or isinstance(amt, bool) or amt <= 0:
                errors.append(
                    f"[JSON logika] {rec_label}: `resolved` musi mieć `amountPln > 0` (jest: {amt!r})."
                )
            if not is_valid_iso_date(cdate):
                errors.append(
                    f"[JSON logika] {rec_label}: `resolved` musi mieć `contractDate` w formacie YYYY-MM-DD (jest: {cdate!r})."
                )
            if (
                not isinstance(contractors, list)
                or len(contractors) == 0
                or not all(isinstance(c, str) and c.strip() for c in contractors)
            ):
                errors.append(
                    f"[JSON logika] {rec_label}: `resolved` musi mieć niepustą tablicę stringów `contractors`."
                )
        elif status in {"open_or_pending", "cancelled"}:
            if amt is not None:
                errors.append(
                    f"[JSON logika] {rec_label}: status `{status}` musi mieć `amountPln: null` (jest: {amt!r})."
                )

        bids = r.get("bids")
        if bids is not None:
            if not isinstance(bids, int) or isinstance(bids, bool):
                errors.append(f"[JSON logika] {rec_label}: `bids` musi być liczbą całkowitą lub null (jest: {bids!r}).")
            elif status == "resolved" and bids < 1:
                errors.append(f"[JSON logika] {rec_label}: `resolved` nie może mieć `bids < 1` (jest: {bids}).")

        url = r["url"]
        if isinstance(url, str) and (
            not url.startswith(BZP_URL_PREFIX) or len(url) <= len(BZP_URL_PREFIX)
        ):
            errors.append(
                f"[JSON logika] {rec_label}: `url` nie zaczyna się od {BZP_URL_PREFIX!r}: {url!r}."
            )

        # 4. String hygiene (#31)
        _walk_strings_and_numbers(r, "", rec_label, errors)

        cpv = r.get("cpv")
        if cpv is not None:
            if not isinstance(cpv, str):
                errors.append(f"[JSON higiena] {rec_label}: `cpv` musi być stringiem lub null.")
            elif not has_balanced_parens(cpv):
                errors.append(
                    f"[JSON higiena] {rec_label}: niezbilansowane lub niedomknięte nawiasy w `cpv`: {cpv!r}."
                )

        if isinstance(contractors, list):
            for c in contractors:
                if not isinstance(c, str):
                    continue
                if (
                    re.search(r"\b(?:NIP|REGON)\s", c)
                    or c.rstrip().endswith((", ul.", " ul.", "NIP", "REGON"))
                    or ", ul." in c
                ):
                    errors.append(
                        f"[JSON higiena] {rec_label}: surowy dopisek NIP / REGON / `, ul.` w nazwie wykonawcy: {c!r}."
                    )
                norm_c = normalize_sp_zoo_key(c)
                contractor_norm_map[norm_c].add(c)

    for norm_key, variants in sorted(contractor_norm_map.items()):
        if len(variants) > 1:
            errors.append(
                f"[JSON higiena] Duplikaty nazwy wykonawcy różniące się wielkością liter lub zapisem `Sp. z o.o.`: "
                f"{sorted(variants)}."
            )

    return valid_records


# ---------------------------------------------------------------------------
# Preset simulation helper (for #fig-vendors & preset checking)
# ---------------------------------------------------------------------------


def _fold_ascii(text: str) -> str:
    return (
        text.lower()
        .replace("ą", "a")
        .replace("ć", "c")
        .replace("ę", "e")
        .replace("ł", "l")
        .replace("ń", "n")
        .replace("ó", "o")
        .replace("ś", "s")
        .replace("ź", "z")
        .replace("ż", "z")
    )


def filter_records_by_preset(
    records: list[dict[str, Any]],
    preset_qs: str,
) -> list[dict[str, Any]]:
    params = dict(urllib.parse.parse_qsl(preset_qs, keep_blank_values=True))
    inc = params.get("incidental") == "1" or params.get("cat") == "incidental"
    pure = params.get("pure") == "1"
    st = params.get("status", "all")
    sub = params.get("sub", "")
    cat = params.get("cat", "")
    sector = params.get("sector", "")
    prov = params.get("prov", "")
    yr = params.get("year", "")
    cyr = params.get("cyear", "")
    single = params.get("single") == "1"
    sole = params.get("sole") == "1"
    btier_raw = params.get("btier", "")
    if btier_raw not in ALLOWED_PRESET_BTIERS:
        raise ValueError(
            f"Unsupported btier={btier_raw!r} in preset {preset_qs!r}; "
            f"allowed: {sorted(ALLOWED_PRESET_BTIERS)}"
        )
    btier = "" if (single or sole) else btier_raw
    eu = params.get("eu") == "1"
    q = params.get("q", "").lower().strip()
    q_folded = _fold_ascii(q)

    matched: list[dict[str, Any]] = []
    for r in records:
        scope = r.get("aiScope") or ("incidental" if r.get("category") == "incidental" else "pure")
        if not inc and (r.get("category") == "incidental" or scope == "incidental"):
            continue
        if pure and scope == "mixed":
            continue
        if st != "all" and r.get("status") != st:
            continue
        if sub and effective_sub_status(r) != sub:
            continue
        if cat and r.get("category") != cat:
            continue
        if sector and r.get("sector") != sector:
            continue
        if prov and r.get("province") != prov:
            continue
        if yr and str(r.get("year")) != yr:
            continue
        if cyr and str(r.get("contractDate") or "")[:4] != cyr:
            continue
        if single and r.get("bids") != 1:
            continue
        if sole and not (r.get("status") == "resolved" and r.get("bids") is None):
            continue
        if btier == "2-3" and not (r.get("bids") is not None and 2 <= r["bids"] <= 3):
            continue
        if btier == "4p" and not (r.get("bids") is not None and r["bids"] >= 4):
            continue
        if eu and not r.get("eu"):
            continue
        if q:
            hay = " ".join(
                [
                    str(r.get("title") or ""),
                    str(r.get("org") or ""),
                    str(r.get("city") or ""),
                    str(r.get("province") or ""),
                    str(r.get("bzp") or ""),
                    str(r.get("cpv") or ""),
                    " ".join(str(c) for c in (r.get("contractors") or [])),
                ]
            ).lower()
            if q not in hay and q_folded not in _fold_ascii(hay):
                continue
        matched.append(r)
    return matched


# ---------------------------------------------------------------------------
# Section B: HTML KPI Consistency Across 6 PL/EN Pages
# ---------------------------------------------------------------------------


def _expect_eq(
    actual: Any,
    expected: Any,
    ctx: str,
    errors: list[str],
) -> None:
    if actual != expected:
        errors.append(f"[HTML KPI] {ctx}: w HTML jest {actual!r}, a z JSON wynika {expected!r}.")


def _extract_meta_map(doc: HtmlNode) -> dict[str, list[str]]:
    out: dict[str, list[str]] = defaultdict(list)
    for m in doc.find_all(tag="meta"):
        content = m.attrs.get("content", "").strip()
        if "name" in m.attrs and m.attrs["name"]:
            out[f"name:{m.attrs['name'].lower()}"].append(content)
        if "property" in m.attrs and m.attrs["property"]:
            out[f"property:{m.attrs['property'].lower()}"].append(content)
    return out


def _get_meta_first(meta_map: dict[str, list[str]], key: str) -> str:
    if key.startswith(("name:", "property:")):
        vals = meta_map.get(key.lower(), [])
        return vals[0] if vals else ""
    for prefix in ("name:", "property:"):
        vals = meta_map.get(prefix + key.lower(), [])
        if vals:
            return vals[0]
    return ""


def _validate_report_findings(
    rel_path: str,
    lang: str,
    doc: HtmlNode,
    kpis: dict[str, Any],
    errors: list[str],
) -> dict[str, Any]:
    """Validates the 4 .lab-findings tiles in PL or EN report and returns extracted Tile 2 mode."""
    wrap = doc.find_one(cls="lab-findings")
    if wrap is None:
        errors.append(f"[HTML KPI] {rel_path}: brak kontenera `.lab-findings`.")
        return {}

    cards = wrap.find_all(cls="lab-finding")
    if len(cards) != 4:
        errors.append(
            f"[HTML KPI] {rel_path}: oczekiwano 4 kafelków `.lab-finding`, znaleziono {len(cards)}."
        )
        return {}

    def card_parts(card: HtmlNode) -> tuple[str, str, str]:
        num_el = card.find_one(cls="lab-finding-num")
        lbl_el = card.find_one(cls="lab-finding-label")
        note_el = card.find_one(cls="lab-finding-note")
        return (
            num_el.spaced_text() if num_el else "",
            lbl_el.spaced_text() if lbl_el else "",
            note_el.spaced_text() if note_el else "",
        )

    # Tile 1: Core spend in M PLN, signed core contracts, core proceedings
    num1, lbl1, note1 = card_parts(cards[0])
    m_num1 = re.search(r"(\d+[,.]\d+)", num1)
    _expect_eq(
        m_num1.group(1) if m_num1 else None,
        fmt_mln_num(kpis["core_sum_pln"], lang),
        f"{rel_path} `.lab-findings` kafelek #1 (łączna kwota w mln)",
        errors,
    )
    m_signed1 = re.search(r"(\d+)\s+(?:podpisanych|signed)", lbl1)
    _expect_eq(
        int(m_signed1.group(1)) if m_signed1 else None,
        kpis["core_signed_count"],
        f"{rel_path} `.lab-findings` kafelek #1 (liczba podpisanych umów podstawowych)",
        errors,
    )
    m_proc1 = re.search(r"(\d+)\s+(?:postępowań|core proceedings)", note1)
    _expect_eq(
        int(m_proc1.group(1)) if m_proc1 else None,
        kpis["core_count"],
        f"{rel_path} `.lab-findings` kafelek #1 (liczba postępowań podstawowych)",
        errors,
    )

    # Tile 2: Annual growth (consistent with either notice-year or contract-year basis)
    num2, lbl2, note2 = card_parts(cards[1])
    m_mult = re.search(r"(\d+[,.]\d+)", num2)
    if lang == "pl":
        mln_vals = re.findall(r"(\d+,\d+)\s*mln\s*zł", lbl2)
    else:
        mln_vals = re.findall(r"(\d+\.\d+)\s*M\s*PLN", lbl2)
    m_note2 = re.search(r"(\d+)", note2)

    tile2_tuple = (
        m_mult.group(1) if m_mult else None,
        mln_vals[0] if len(mln_vals) >= 1 else None,
        mln_vals[1] if len(mln_vals) >= 2 else None,
        int(m_note2.group(1)) if m_note2 else None,
    )
    expected_notice = (
        fmt_num(kpis["notice_mult_2026_2024"], 1, lang),
        fmt_mln_num(kpis["notice_years"]["2024"].sum_pln, lang),
        fmt_mln_num(kpis["notice_years"]["2026"].sum_pln, lang),
        kpis["notice_years"]["2026"].signed_count,
    )
    expected_contract = (
        fmt_num(kpis["contract_mult_2026_2024"], 1, lang),
        fmt_mln_num(kpis["contract_years"]["2024"].sum_pln, lang),
        fmt_mln_num(kpis["contract_years"]["2026"].sum_pln, lang),
        kpis["contract_years"]["2026"].signed_count,
    )
    tile2_basis = None
    if tile2_tuple == expected_notice:
        tile2_basis = "notice"
    elif tile2_tuple == expected_contract:
        tile2_basis = "contract"
    else:
        errors.append(
            f"[HTML KPI] {rel_path} `.lab-findings` kafelek #2 (dynamika roczna): "
            f"znaleziono {tile2_tuple}, oczekiwano wg roku ogłoszenia {expected_notice} "
            f"lub wg roku umowy {expected_contract}."
        )

    # Tile 3: Software + hardware share & sum, training proc share, training spend share, training median
    num3, lbl3, note3 = card_parts(cards[2])
    sh = kpis["sw_hw"]
    tr: CategoryKpi = kpis["categories"]["training"]

    m_num3 = re.search(r"(\d+[,.]\d+)", num3)
    _expect_eq(
        m_num3.group(1) if m_num3 else None,
        fmt_num(sh["spend_pct"], 1, lang),
        f"{rel_path} `.lab-findings` kafelek #3 (% budżetu software+hardware)",
        errors,
    )
    m_sh_mln = (
        re.search(r"(\d+,\d+)\s*mln\s*zł", lbl3)
        if lang == "pl"
        else re.search(r"(\d+\.\d+)\s*M\s*PLN", lbl3)
    )
    _expect_eq(
        m_sh_mln.group(1) if m_sh_mln else None,
        fmt_mln_num(sh["sum_pln"], lang),
        f"{rel_path} `.lab-findings` kafelek #3 (kwota software+hardware w mln)",
        errors,
    )
    pct_in_lbl3 = re.findall(r"(\d+[,.]\d+)%", lbl3)
    expected_tr_pcts = [fmt_num(tr.proc_pct, 1, lang), fmt_num(tr.spend_pct, 1, lang)]
    _expect_eq(
        pct_in_lbl3,
        expected_tr_pcts,
        f"{rel_path} `.lab-findings` kafelek #3 (udział % szkoleń w ogłoszeniach i kwocie)",
        errors,
    )
    m_tr_med = (
        re.search(r"(\d+(?:,\d+)?)\s*tys\.\s*zł", note3)
        if lang == "pl"
        else re.search(r"(\d+(?:\.\d+)?)\s*k\s*PLN", note3)
    )
    if m_tr_med:
        raw_med_s = m_tr_med.group(1)
        places = 1 if ("," in raw_med_s or "." in raw_med_s) else 0
        expected_med_s = (
            str(round_int(tr.median_pln / Decimal("1000")))
            if places == 0
            else fmt_num(tr.median_pln / Decimal("1000"), 1, lang)
        )
        _expect_eq(
            raw_med_s,
            expected_med_s,
            f"{rel_path} `.lab-findings` kafelek #3 (mediana szkolenia w tys.)",
            errors,
        )
    else:
        errors.append(f"[HTML KPI] {rel_path} `.lab-findings` kafelek #3: nie znaleziono mediany szkolenia w `{note3}`.")

    # Tile 4: Single-bid share in software_deploy & overall in core
    num4, lbl4, note4 = card_parts(cards[3])
    sw: CategoryKpi = kpis["categories"]["software_deploy"]
    comp = kpis["competition"]

    m_num4 = re.search(r"(\d+[,.]\d+)", num4)
    _expect_eq(
        m_num4.group(1) if m_num4 else None,
        fmt_num(sw.single_bid_pct, 1, lang),
        f"{rel_path} `.lab-findings` kafelek #4 (% umów z 1 ofertą w software_deploy)",
        errors,
    )
    m_sw_pair = re.search(r"\((\d+)\s+(?:z|of)\s+(\d+)", lbl4)
    _expect_eq(
        (int(m_sw_pair.group(1)), int(m_sw_pair.group(2))) if m_sw_pair else None,
        (sw.single_bid_count, sw.with_bids_count),
        f"{rel_path} `.lab-findings` kafelek #4 (liczba umów 1-ofertowych w software_deploy)",
        errors,
    )
    m_all_pct = re.search(r"(\d+[,.]\d+)%", note4)
    _expect_eq(
        m_all_pct.group(1) if m_all_pct else None,
        fmt_num(comp["single_bid_pct"], 1, lang),
        f"{rel_path} `.lab-findings` kafelek #4 (% umów z 1 ofertą ogółem w core)",
        errors,
    )
    m_all_pair = re.search(r"\((\d+)\s+(?:z|of)\s+(\d+)\)", note4)
    if m_all_pair:
        _expect_eq(
            (int(m_all_pair.group(1)), int(m_all_pair.group(2))),
            (comp["single_bid_count"], comp["with_bids_count"]),
            f"{rel_path} `.lab-findings` kafelek #4 (ułamek umów 1-ofertowych ogółem w core)",
            errors,
        )

    return {"tile2_basis": tile2_basis, "tile2_tuple": tile2_tuple}


def _validate_report_meta_descriptions(
    rel_path: str,
    lang: str,
    meta_map: dict[str, list[str]],
    kpis: dict[str, Any],
    errors: list[str],
) -> None:
    desc = _get_meta_first(meta_map, "name:description")
    og_desc = _get_meta_first(meta_map, "property:og:description")
    tw_desc = _get_meta_first(meta_map, "twitter:description")

    # <meta name="description">
    m_proc_desc = re.search(r"(\d+)\s+(?:AI-related\s+public\s+procurement\s+proceedings|postępowań)", desc)
    if not m_proc_desc:
        m_proc_desc = re.search(r"\b(\d+)\b.*?(?:postępowa|proceeding|tender)", desc, re.I)
    _expect_eq(
        int(m_proc_desc.group(1)) if m_proc_desc else None,
        kpis["all_count"],
        f"{rel_path} `<meta name=\"description\">` (liczba postępowań)",
        errors,
    )

    # Check og:description (and twitter:description if it carries the KPI summary)
    for tag_label, text in (
        ('<meta property="og:description">', og_desc),
        ('<meta name="twitter:description">', tw_desc),
    ):
        if not text:
            continue
        # Proceedings count (if mentioned)
        m_proc = re.search(r"(\d+)\s+(?:public\s+tenders|proceedings|postępowań|przetargów)", text, re.I)
        if tag_label == '<meta property="og:description">' or m_proc:
            _expect_eq(
                int(m_proc.group(1)) if m_proc else None,
                kpis["all_count"],
                f"{rel_path} `{tag_label}` (liczba postępowań)",
                errors,
            )

        # Signed core contracts total M PLN (if mentioned)
        m_mln = (
            re.search(r"(\d+,\d+)\s*mln\s*zł", text)
            if lang == "pl"
            else re.search(r"(\d+\.\d+)\s*M\s*PLN", text)
        )
        if tag_label == '<meta property="og:description">' or m_mln:
            _expect_eq(
                m_mln.group(1) if m_mln else None,
                fmt_mln_num(kpis["core_sum_pln"], lang),
                f"{rel_path} `{tag_label}` (suma umów podstawowych w mln)",
                errors,
            )

        # Software+hardware share ("Ponad 90%" / "Over 90%" or exact "90,8%" / "90.8%")
        sh_pct = kpis["sw_hw"]["spend_pct"]
        m_over = re.search(r"(?:Ponad|Over)\s+(\d+)%", text, re.I)
        m_exact_sh = re.search(
            r"(\d+[,.]\d+)%\s+(?:kwoty|budżetu|wartości(?:\s+umów)?|of\s+(?:(?:contract(?:ed)?\s+)?(?:value|spend)))",
            text,
            re.I,
        )
        if m_over:
            floor_pct = int(m_over.group(1))
            if not (Decimal(floor_pct) < sh_pct < Decimal(floor_pct + 10)):
                errors.append(
                    f"[HTML KPI] {rel_path} `{tag_label}`: sformułowanie `{m_over.group(0)}` niezgodne "
                    f"z udziałem software+hardware ({fmt_num(sh_pct, 1, lang)}%)."
                )
        elif m_exact_sh:
            _expect_eq(
                m_exact_sh.group(1),
                fmt_num(sh_pct, 1, lang),
                f"{rel_path} `{tag_label}` (% software+hardware)",
                errors,
            )
        elif tag_label == '<meta property="og:description">':
            errors.append(
                f"[HTML KPI] {rel_path} `{tag_label}`: brak udziału % software+hardware w opisie."
            )

        # Software single-bid share ("68%" or "68,4%" / "68.4%")
        sw_pct = kpis["categories"]["software_deploy"].single_bid_pct
        m_sw_pct = re.search(
            r"(\d+(?:[,.]\d+)?)%\s+(?:systemów\s+IT|wdrożeń|of\s+(?:AI\s+)?(?:IT|software)\s+deployments)",
            text,
            re.I,
        )
        if tag_label == '<meta property="og:description">' or m_sw_pct:
            if not m_sw_pct:
                errors.append(
                    f"[HTML KPI] {rel_path} `{tag_label}`: brak udziału % wdrożeń IT z 1 ofertą."
                )
            else:
                found_sw = m_sw_pct.group(1)
                exp_sw = (
                    fmt_num(sw_pct, 1, lang)
                    if ("," in found_sw or "." in found_sw)
                    else str(round_int(sw_pct))
                )
                _expect_eq(
                    found_sw,
                    exp_sw,
                    f"{rel_path} `{tag_label}` (% wdrożeń IT z 1 ofertą)",
                    errors,
                )


def _validate_report_noscripts(
    rel_path: str,
    lang: str,
    doc: HtmlNode,
    kpis: dict[str, Any],
    errors: list[str],
) -> str | None:
    """Validates all 3 <noscript> blocks in the report and returns fig-illusion annual basis."""
    fig_ill = doc.find_one(attr_id="fig-illusion")
    fig_comp = doc.find_one(attr_id="fig-competition")
    explorer = doc.find_one(attr_id="bzp-explorer")

    ill_basis: str | None = None

    # 1. #fig-illusion <noscript>
    ns_ill = fig_ill.find_one(tag="noscript") if fig_ill else None
    if ns_ill is None:
        errors.append(f"[HTML KPI] {rel_path}: brak bloku `<noscript>` wewnątrz `#fig-illusion`.")
    else:
        txt = ns_ill.spaced_text()
        anchors = (
            [
                ("software_deploy", "Wdrożenia i systemy AI:"),
                ("hardware_lab", "Sprzęt GPU i laboratoria:"),
                ("training", "Szkolenia i kursy:"),
                ("consulting", "Badania i audyty:"),
            ]
            if lang == "pl"
            else [
                ("software_deploy", "AI software & deployments:"),
                ("hardware_lab", "GPU servers & lab hardware:"),
                ("training", "Trainings & workshops:"),
                ("consulting", "Research & advisory:"),
            ]
        )
        positions: list[tuple[int, str, str]] = []
        for ck, label in anchors:
            pos = txt.find(label)
            if pos == -1:
                errors.append(
                    f"[HTML KPI] {rel_path} `#fig-illusion <noscript>`: brak sekcji kategorii `{label}`."
                )
            else:
                positions.append((pos, ck, label))
        positions.sort()

        ann_marker = "Dynamika roczna" if lang == "pl" else "Annual signed"
        ann_pos = txt.find(ann_marker)

        for i, (pos, ck, label) in enumerate(positions):
            end_pos = (
                positions[i + 1][0]
                if i + 1 < len(positions)
                else (ann_pos if ann_pos != -1 else len(txt))
            )
            seg = txt[pos:end_pos]
            cat: CategoryKpi = kpis["categories"][ck]

            pcts = re.findall(r"(\d+[,.]\d+)%", seg)
            _expect_eq(
                pcts[:2],
                [fmt_num(cat.proc_pct, 1, lang), fmt_num(cat.spend_pct, 1, lang)],
                f"{rel_path} `#fig-illusion <noscript>` [{ck}] (% postępowań i % kwoty)",
                errors,
            )
            m_cnt = re.search(r"\((\d+)\)", seg)
            _expect_eq(
                int(m_cnt.group(1)) if m_cnt else None,
                cat.proc_count,
                f"{rel_path} `#fig-illusion <noscript>` [{ck}] (liczba postępowań)",
                errors,
            )
            m_mln = (
                re.search(r"(\d+,\d+)\s*mln\s*zł", seg)
                if lang == "pl"
                else re.search(r"(\d+\.\d+)\s*M\s*PLN", seg)
            )
            _expect_eq(
                m_mln.group(1) if m_mln else None,
                fmt_mln_num(cat.sum_pln, lang),
                f"{rel_path} `#fig-illusion <noscript>` [{ck}] (kwota w mln)",
                errors,
            )
            if ck in {"software_deploy", "hardware_lab", "training"}:
                m_med = (
                    re.search(r"mediana\s+(\d+(?:,\d+)?)\s*tys\.\s*zł", seg)
                    if lang == "pl"
                    else re.search(r"median\s+(\d+(?:\.\d+)?)\s*k\s*PLN", seg)
                )
                if not m_med:
                    errors.append(
                        f"[HTML KPI] {rel_path} `#fig-illusion <noscript>` [{ck}]: brak mediany."
                    )
                else:
                    found_med = m_med.group(1)
                    places = 1 if ("," in found_med or "." in found_med) else 0
                    exp_med = (
                        str(round_int(cat.median_pln / Decimal("1000")))
                        if places == 0
                        else fmt_num(cat.median_pln / Decimal("1000"), 1, lang)
                    )
                    _expect_eq(
                        found_med,
                        exp_med,
                        f"{rel_path} `#fig-illusion <noscript>` [{ck}] (mediana w tys.)",
                        errors,
                    )

        if ann_pos == -1:
            errors.append(
                f"[HTML KPI] {rel_path} `#fig-illusion <noscript>`: brak zdania o dynamice rocznej (`{ann_marker}`)."
            )
        else:
            ann_seg = txt[ann_pos:]
            year_pairs = (
                re.findall(r"(202[3-6])[^—–-]*[—–-]\s*(\d+,\d+)\s*mln\s*zł", ann_seg)
                if lang == "pl"
                else re.findall(r"(202[3-6])[^—–-]*[—–-]\s*(\d+\.\d+)\s*M\s*PLN", ann_seg)
            )
            found_yr_map = dict(year_pairs)
            exp_notice_map = {
                y: fmt_mln_num(yk.sum_pln, lang) for y, yk in kpis["notice_years"].items()
            }
            exp_contract_full = {
                y: fmt_mln_num(yk.sum_pln, lang)
                for y, yk in kpis["contract_years"].items()
                if y in {"2023", "2024", "2025", "2026"}
            }
            exp_contract_24_26 = {
                k: v for k, v in exp_contract_full.items() if k in {"2024", "2025", "2026"}
            }
            if found_yr_map == exp_notice_map:
                ill_basis = "notice"
            elif found_yr_map in (exp_contract_full, exp_contract_24_26):
                ill_basis = "contract"
            else:
                errors.append(
                    f"[HTML KPI] {rel_path} `#fig-illusion <noscript>` (dynamika roczna): "
                    f"znaleziono {found_yr_map}, oczekiwano wg roku ogłoszenia {exp_notice_map} "
                    f"lub wg roku umowy {exp_contract_full}."
                )

    # 2. #fig-competition <noscript>
    ns_comp = fig_comp.find_one(tag="noscript") if fig_comp else None
    if ns_comp is None:
        errors.append(f"[HTML KPI] {rel_path}: brak bloku `<noscript>` wewnątrz `#fig-competition`.")
    else:
        txt = ns_comp.spaced_text()
        comp = kpis["competition"]
        sw = kpis["categories"]["software_deploy"]

        m_head = (
            re.search(
                r"Wśród\s+(\d+)\s+podpisanych.*?aż\s+(\d+)\s*\((\d+,\d+)%\)",
                txt,
            )
            if lang == "pl"
            else re.search(
                r"Out of\s+(\d+)\s+signed.*?(\d+)\s*\((\d+\.\d+)%\)",
                txt,
            )
        )
        _expect_eq(
            (int(m_head.group(1)), int(m_head.group(2)), m_head.group(3)) if m_head else None,
            (
                comp["with_bids_count"],
                comp["single_bid_count"],
                fmt_num(comp["single_bid_pct"], 1, lang),
            ),
            f"{rel_path} `#fig-competition <noscript>` (umowy z jawnym bids i 1 ofertą ogółem)",
            errors,
        )

        m_sw = re.search(r"(\d+)\s+(?:z|of)\s+(\d+)", txt)
        _expect_eq(
            (int(m_sw.group(1)), int(m_sw.group(2))) if m_sw else None,
            (sw.single_bid_count, sw.with_bids_count),
            f"{rel_path} `#fig-competition <noscript>` (umowy 1-ofertowe w software_deploy)",
            errors,
        )

        top_recs = comp["top_bids_records"]
        if len(top_recs) >= 2:
            bid_amt_matches = (
                re.findall(r"(\d+)\s+ofert\w*\s+przy\s+umowie\s+na\s+([\d\s\u00a0\u202f]+)\s*zł", txt)
                if lang == "pl"
                else re.findall(r"(\d+)\s+bids\s+for\s+a\s+([\d,\s\u00a0\u202f]+)\s*PLN", txt)
            )
            parsed_top2 = [
                (int(b), int(re.sub(r"[\s\u00a0\u202f,]", "", amt)))
                for b, amt in bid_amt_matches[:2]
            ]
            expected_top2 = [
                (top_recs[0]["bids"], round_int(to_dec(top_recs[0]["amountPln"]))),
                (top_recs[1]["bids"], round_int(to_dec(top_recs[1]["amountPln"]))),
            ]
            _expect_eq(
                parsed_top2,
                expected_top2,
                f"{rel_path} `#fig-competition <noscript>` (rekordziści liczby ofert)",
                errors,
            )

    # 3. #bzp-explorer <noscript>
    ns_exp = explorer.find_one(tag="noscript") if explorer else None
    if ns_exp is None:
        errors.append(f"[HTML KPI] {rel_path}: brak bloku `<noscript>` wewnątrz `#bzp-explorer`.")
    else:
        txt = ns_exp.spaced_text()
        m_all = re.search(r"(\d+)\s+(?:postępowań|proceedings)", txt)
        _expect_eq(
            int(m_all.group(1)) if m_all else None,
            kpis["all_count"],
            f"{rel_path} `#bzp-explorer <noscript>` (liczba wszystkich postępowań)",
            errors,
        )

    return ill_basis


def _validate_fig_vendors(
    rel_path: str,
    lang: str,
    doc: HtmlNode,
    records: list[dict[str, Any]],
    kpis: dict[str, Any],
    errors: list[str],
) -> list[tuple[int, int, str]]:
    table = doc.find_one(tag="table", attr_id="fig-vendors")
    if table is None:
        errors.append(f"[HTML KPI] {rel_path}: brak tabeli `#fig-vendors`.")
        return []

    tbody = table.find_one(tag="tbody")
    rows = tbody.find_all(tag="tr") if tbody else table.find_all(tag="tr")
    if not rows:
        errors.append(f"[HTML KPI] {rel_path}: tabela `#fig-vendors` nie ma wierszy.")
        return []

    extracted_rows: list[tuple[int, int, str]] = []
    recurring_checked = 0

    for r_idx, tr in enumerate(rows, start=1):
        tds = [ch for ch in tr.children if isinstance(ch, HtmlNode) and ch.tag == "td"]
        if len(tds) < 4:
            errors.append(
                f"[HTML KPI] {rel_path} `#fig-vendors` wiersz #{r_idx}: oczekiwano 4 kolumn `<td>`, znaleziono {len(tds)}."
            )
            continue

        vendor_label = tds[0].spaced_text()
        num_text = tds[2].spaced_text()
        link_el = tds[3].find_one(tag="a")
        preset_str = link_el.attrs.get("data-bzp-preset", "") if link_el else ""
        link_text = link_el.spaced_text() if link_el else ""

        if lang == "pl":
            m_num = re.search(r"(\d+)\s+um\w+\s*[·•-]\s*([\d\s\u00a0\u202f]+)\s*zł", num_text)
        else:
            m_num = re.search(r"(\d+)\s+contracts?\s*[·•-]\s*([\d,\s\u00a0\u202f]+)\s*PLN", num_text)

        if not m_num:
            errors.append(
                f"[HTML KPI] {rel_path} `#fig-vendors` wiersz #{r_idx} ({vendor_label!r}): "
                f"nie można odczytać liczby umów i kwoty z `{num_text}`."
            )
            continue

        html_count = int(m_num.group(1))
        html_pln = int(re.sub(r"[\s\u00a0\u202f,]", "", m_num.group(2)))
        extracted_rows.append((html_count, html_pln, preset_str))

        # Check preset link count ("Pokaż N" / "View N") & preset evaluation
        m_btn_cnt = re.search(r"(\d+)", link_text)
        if not m_btn_cnt or int(m_btn_cnt.group(1)) != html_count:
            errors.append(
                f"[HTML KPI] {rel_path} `#fig-vendors` wiersz #{r_idx} ({vendor_label!r}): "
                f"liczba w linku `{link_text}` niezgodna z liczbą umów ({html_count})."
            )

        if preset_str:
            preset_matches = filter_records_by_preset(records, preset_str)
            preset_signed = [
                r
                for r in preset_matches
                if r.get("status") == "resolved"
                and isinstance(r.get("amountPln"), (int, float))
                and not isinstance(r.get("amountPln"), bool)
            ]
            preset_sum_int = round_int(
                sum((to_dec(r["amountPln"]) for r in preset_signed), Decimal("0"))
            )
            _expect_eq(
                html_count,
                len(preset_signed),
                f"{rel_path} `#fig-vendors` wiersz #{r_idx} ({vendor_label!r}, preset `{preset_str}` -> liczba umów)",
                errors,
            )
            _expect_eq(
                html_pln,
                preset_sum_int,
                f"{rel_path} `#fig-vendors` wiersz #{r_idx} ({vendor_label!r}, preset `{preset_str}` -> kwota PLN)",
                errors,
            )

        # For recurring vendors (count >= 2), also cross-check directly against contractor entity totals
        if html_count >= 2:
            recurring_checked += 1
            ckey = canonical_vendor_entity_key(vendor_label)
            vkpi: VendorKpi | None = kpis["vendors_all"].get(ckey)
            if vkpi is None:
                errors.append(
                    f"[HTML KPI] {rel_path} `#fig-vendors` wiersz #{r_idx}: wykonawca {vendor_label!r} "
                    f"nie występuje wśród podpisanych umów podstawowych w JSON."
                )
            else:
                _expect_eq(
                    html_count,
                    vkpi.signed_count,
                    f"{rel_path} `#fig-vendors` wykonawca {vendor_label!r} (liczba umów w JSON)",
                    errors,
                )
                _expect_eq(
                    html_pln,
                    round_int(vkpi.sum_pln),
                    f"{rel_path} `#fig-vendors` wykonawca {vendor_label!r} (łączna kwota brutto PLN w JSON)",
                    errors,
                )

    if recurring_checked == 0:
        errors.append(
            f"[HTML KPI] {rel_path} `#fig-vendors`: brak wierszy powtarzających się wykonawców (`umowy >= 2`)."
        )

    return extracted_rows


def _validate_lab_hub_page(
    rel_path: str,
    lang: str,
    doc: HtmlNode,
    kpis: dict[str, Any],
    errors: list[str],
) -> None:
    stats_wrap = doc.find_one(cls="lab-hub-stats")
    if stats_wrap is None:
        errors.append(f"[HTML KPI] {rel_path}: brak kontenera `.lab-hub-stats`.")
        return

    items = stats_wrap.find_all(cls="lab-hub-stat")
    if len(items) != 3:
        errors.append(
            f"[HTML KPI] {rel_path}: oczekiwano 3 elementów `.lab-hub-stat`, znaleziono {len(items)}."
        )
        return

    # Stat 1: 31,97 mln zł / 31.97M PLN + 99 signed core contracts
    s0_strong = items[0].find_one(tag="strong")
    s0_span = items[0].find_one(tag="span")
    m_mln = re.search(r"(\d+[,.]\d+)", s0_strong.spaced_text() if s0_strong else "")
    _expect_eq(
        m_mln.group(1) if m_mln else None,
        fmt_mln_num(kpis["core_sum_pln"], lang),
        f"{rel_path} `.lab-hub-stats` #1 (łączna kwota w mln)",
        errors,
    )
    m_signed = re.search(r"(\d+)", s0_span.spaced_text() if s0_span else "")
    _expect_eq(
        int(m_signed.group(1)) if m_signed else None,
        kpis["core_signed_count"],
        f"{rel_path} `.lab-hub-stats` #1 (liczba podpisanych umów podstawowych)",
        errors,
    )

    # Stat 2: 68,4% / 68.4% single-bid software deployments
    s1_strong = items[1].find_one(tag="strong")
    m_sw = re.search(r"(\d+[,.]\d+)", s1_strong.spaced_text() if s1_strong else "")
    _expect_eq(
        m_sw.group(1) if m_sw else None,
        fmt_num(kpis["categories"]["software_deploy"].single_bid_pct, 1, lang),
        f"{rel_path} `.lab-hub-stats` #2 (% wdrożeń oprogramowania z 1 ofertą)",
        errors,
    )

    # Stat 3: 171 proceedings / tenders
    s2_strong = items[2].find_one(tag="strong")
    m_all = re.search(r"(\d+)", s2_strong.spaced_text() if s2_strong else "")
    _expect_eq(
        int(m_all.group(1)) if m_all else None,
        kpis["all_count"],
        f"{rel_path} `.lab-hub-stats` #3 (liczba wszystkich postępowań)",
        errors,
    )


def _validate_home_page(
    rel_path: str,
    lang: str,
    doc: HtmlNode,
    kpis: dict[str, Any],
    errors: list[str],
) -> None:
    metrics = doc.find_all(cls="lab-home-metric")
    if len(metrics) != 2:
        errors.append(
            f"[HTML KPI] {rel_path}: oczekiwano 2 elementów `.lab-home-metric`, znaleziono {len(metrics)}."
        )
        return

    # Metric 1: 31,97 mln zł / 31.97M PLN + 99 signed core contracts
    m0_strong = metrics[0].find_one(tag="strong")
    m0_span = metrics[0].find_one(tag="span")
    m_mln = re.search(r"(\d+[,.]\d+)", m0_strong.spaced_text() if m0_strong else "")
    _expect_eq(
        m_mln.group(1) if m_mln else None,
        fmt_mln_num(kpis["core_sum_pln"], lang),
        f"{rel_path} `.lab-home-metric` #1 (łączna kwota w mln)",
        errors,
    )
    m_signed = re.search(r"(\d+)", m0_span.spaced_text() if m0_span else "")
    _expect_eq(
        int(m_signed.group(1)) if m_signed else None,
        kpis["core_signed_count"],
        f"{rel_path} `.lab-home-metric` #1 (liczba podpisanych umów podstawowych)",
        errors,
    )

    # Metric 2: 68,4% / 68.4% single-bid software deployments
    m1_strong = metrics[1].find_one(tag="strong")
    m_sw = re.search(r"(\d+[,.]\d+)", m1_strong.spaced_text() if m1_strong else "")
    _expect_eq(
        m_sw.group(1) if m_sw else None,
        fmt_num(kpis["categories"]["software_deploy"].single_bid_pct, 1, lang),
        f"{rel_path} `.lab-home-metric` #2 (% wdrożeń oprogramowania z 1 ofertą)",
        errors,
    )


# ---------------------------------------------------------------------------
# Section C: Links, Presets, Internal Anchors & SEO/OG/Twitter Tags
# ---------------------------------------------------------------------------


def _validate_anchors_and_presets(
    rel_path: str,
    doc: HtmlNode,
    id_occurrences: list[tuple[str, int]],
    known_sectors: set[str],
    known_provinces: set[str],
    errors: list[str],
) -> None:
    id_counts = Counter(el_id for el_id, _ in id_occurrences)
    for dup_id, cnt in sorted(id_counts.items()):
        if cnt > 1:
            errors.append(
                f"[HTML kotwice] {rel_path}: zduplikowany atrybut `id=\"{dup_id}\"` ({cnt} razy)."
            )
    known_ids = set(id_counts.keys())

    for el in doc.iter_elements():
        # Internal anchors href="#..." (and same-document query+anchor href="?..#...")
        if "href" in el.attrs:
            href = el.attrs["href"].strip()
            if href == "#":
                errors.append(
                    f"[HTML kotwice] {rel_path}:{el.line}: pusta kotwica `href=\"#\"`."
                )
            elif href.startswith("#") or (href.startswith("?") and "#" in href):
                frag = urllib.parse.unquote(href.split("#", 1)[1])
                if not frag or frag not in known_ids:
                    errors.append(
                        f"[HTML kotwice] {rel_path}:{el.line}: wewnętrzna kotwica `href=\"{href}\"` "
                        f"wskazuje na nieistniejące `id=\"{frag}\"`."
                    )

        # data-bzp-preset validation
        if "data-bzp-preset" in el.attrs:
            preset = el.attrs["data-bzp-preset"].strip()
            if not preset:
                errors.append(
                    f"[HTML preset] {rel_path}:{el.line}: pusty atrybut `data-bzp-preset`."
                )
                continue

            pairs = urllib.parse.parse_qsl(preset, keep_blank_values=True)
            if not pairs:
                errors.append(
                    f"[HTML preset] {rel_path}:{el.line}: nieprawidłowy `data-bzp-preset=\"{preset}\"`."
                )
                continue

            for key, val in pairs:
                if key not in ALLOWED_PRESET_PARAMS:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: niewspierany parametr `{key}` w "
                        f"`data-bzp-preset=\"{preset}\"` (dozwolone: {sorted(ALLOWED_PRESET_PARAMS)})."
                    )
                    continue
                if val == "":
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: pusta wartość parametru `{key}` w "
                        f"`data-bzp-preset=\"{preset}\"`."
                    )
                    continue

                if key == "cat" and val not in ALLOWED_CATEGORIES:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieznana kategoria `cat={val}` w "
                        f"`data-bzp-preset=\"{preset}\"` (dozwolone: {sorted(ALLOWED_CATEGORIES)})."
                    )
                elif key == "status" and val not in ALLOWED_PRESET_STATUSES:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieznany `status={val}` w "
                        f"`data-bzp-preset=\"{preset}\"`."
                    )
                elif key == "sub" and val not in ALLOWED_SUB_STATUSES:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieznany `sub={val}` w "
                        f"`data-bzp-preset=\"{preset}\"` (dozwolone: {sorted(ALLOWED_SUB_STATUSES)})."
                    )
                elif key == "sort" and val not in ALLOWED_PRESET_SORTS:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieznany `sort={val}` w "
                        f"`data-bzp-preset=\"{preset}\"`."
                    )
                elif key in {"single", "sole", "eu", "incidental", "pure"} and val not in {"0", "1"}:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: parametr `{key}={val}` musi mieć wartość `0` lub `1`."
                    )
                elif key == "year" and val not in {"2024", "2025", "2026"}:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieprawidłowy `year={val}` (dozwolone: 2024–2026)."
                    )
                elif key == "cyear" and val not in {"2023", "2024", "2025", "2026"}:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieprawidłowy `cyear={val}` (dozwolone: 2023–2026)."
                    )
                elif key == "ymode" and val not in ALLOWED_PRESET_YMODES:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieprawidłowy `ymode={val}` "
                        f"(dozwolone: {sorted(ALLOWED_PRESET_YMODES)})."
                    )
                elif key == "btier" and val not in ALLOWED_PRESET_BTIERS:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieprawidłowy `btier={val}` "
                        f"w `data-bzp-preset=\"{preset}\"` (dozwolone: {sorted(ALLOWED_PRESET_BTIERS - {''})})."
                    )
                elif key == "sector" and known_sectors and val not in known_sectors:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieznany sektor `sector={val}`."
                    )
                elif key == "prov" and known_provinces and val not in known_provinces:
                    errors.append(
                        f"[HTML preset] {rel_path}:{el.line}: nieznane województwo `prov={val}`."
                    )


def _check_local_og_asset(
    repo_root: Path,
    rel_html: str,
    tag_name: str,
    image_url: str,
    errors: list[str],
) -> None:
    if not image_url.startswith(SITE_ORIGIN):
        errors.append(
            f"[SEO/OG] {rel_html}: `{tag_name}` musi zaczynać się od `{SITE_ORIGIN}` (jest: {image_url!r})."
        )
        return
    rel_asset = urllib.parse.unquote(image_url[len(SITE_ORIGIN) :].split("?", 1)[0])
    asset_path = repo_root / Path(rel_asset)
    if not asset_path.is_file() or asset_path.stat().st_size == 0:
        errors.append(
            f"[SEO/OG] {rel_html}: plik obrazu wskazywany przez `{tag_name}` nie istnieje na dysku "
            f"lub jest pusty: `{rel_asset}` (URL: {image_url})."
        )


def _validate_report_seo_pair(
    repo_root: Path,
    pl_rel: str,
    pl_doc: HtmlNode,
    pl_meta: dict[str, list[str]],
    en_rel: str,
    en_doc: HtmlNode,
    en_meta: dict[str, list[str]],
    errors: list[str],
) -> None:
    expected_urls = {
        pl_rel: "https://roleplayingtech.com/pl/lab/przetargi-ai/",
        en_rel: "https://roleplayingtech.com/en/lab/ai-tenders/",
    }

    hreflangs_per_doc: dict[str, dict[str, str]] = {}
    canonicals: dict[str, str] = {}

    for rel, doc, meta in ((pl_rel, pl_doc, pl_meta), (en_rel, en_doc, en_meta)):
        # Canonical & hreflang links
        canon_links = [
            lnk.attrs.get("href", "").strip()
            for lnk in doc.find_all(tag="link")
            if "canonical" in lnk.attrs.get("rel", "").lower().split()
        ]
        if len(canon_links) != 1 or not canon_links[0]:
            errors.append(f"[SEO/OG] {rel}: brak pojedynczego tagu `<link rel=\"canonical\">`.")
            canonicals[rel] = ""
        else:
            canonicals[rel] = canon_links[0]
            if canon_links[0] != expected_urls[rel]:
                errors.append(
                    f"[SEO/OG] {rel}: `canonical` ma wartość {canon_links[0]!r}, oczekiwano {expected_urls[rel]!r}."
                )

        hl_map: dict[str, str] = {}
        for lnk in doc.find_all(tag="link"):
            rels = lnk.attrs.get("rel", "").lower().split()
            hl = lnk.attrs.get("hreflang", "").strip().lower()
            href = lnk.attrs.get("href", "").strip()
            if "alternate" in rels and hl:
                hl_map[hl] = href
        hreflangs_per_doc[rel] = hl_map
        for req_hl in ("pl", "en"):
            if not hl_map.get(req_hl):
                errors.append(f"[SEO/OG] {rel}: brak tagu `<link rel=\"alternate\" hreflang=\"{req_hl}\">`.")

        # Required OpenGraph tags
        for og_prop in ("og:title", "og:description", "og:locale", "og:locale:alternate", "og:image"):
            val = _get_meta_first(meta, f"property:{og_prop}")
            if not val:
                errors.append(f"[SEO/OG] {rel}: brak wymaganego tagu `<meta property=\"{og_prop}\">`.")

        # Required Twitter Card tags
        for tw_key in ("twitter:card", "twitter:title", "twitter:description", "twitter:image"):
            val = _get_meta_first(meta, tw_key)
            if not val:
                errors.append(f"[SEO/OG] {rel}: brak wymaganego tagu `<meta name=\"{tw_key}\">`.")

        # Physical existence of og:image (and twitter:image when present)
        og_img = _get_meta_first(meta, "property:og:image")
        if og_img:
            _check_local_og_asset(repo_root, rel, "og:image", og_img, errors)
        tw_img = _get_meta_first(meta, "twitter:image")
        if tw_img:
            _check_local_og_asset(repo_root, rel, "twitter:image", tw_img, errors)

    # Symmetry checks between PL and EN
    pl_hl = hreflangs_per_doc[pl_rel]
    en_hl = hreflangs_per_doc[en_rel]
    if pl_hl.get("pl") and en_hl.get("pl") and pl_hl["pl"] != en_hl["pl"]:
        errors.append(
            f"[SEO/OG] Niesymetryczne `hreflang=\"pl\"`: PL={pl_hl['pl']!r} vs EN={en_hl['pl']!r}."
        )
    if pl_hl.get("en") and en_hl.get("en") and pl_hl["en"] != en_hl["en"]:
        errors.append(
            f"[SEO/OG] Niesymetryczne `hreflang=\"en\"`: PL={pl_hl['en']!r} vs EN={en_hl['en']!r}."
        )
    if canonicals.get(pl_rel) and pl_hl.get("pl") and pl_hl["pl"] != canonicals[pl_rel]:
        errors.append(
            f"[SEO/OG] {pl_rel}: `hreflang=\"pl\"` ({pl_hl['pl']!r}) != `canonical` ({canonicals[pl_rel]!r})."
        )
    if canonicals.get(en_rel) and en_hl.get("en") and en_hl["en"] != canonicals[en_rel]:
        errors.append(
            f"[SEO/OG] {en_rel}: `hreflang=\"en\"` ({en_hl['en']!r}) != `canonical` ({canonicals[en_rel]!r})."
        )

    pl_loc = _get_meta_first(pl_meta, "property:og:locale")
    en_loc = _get_meta_first(en_meta, "property:og:locale")
    pl_alt_locs = set(pl_meta.get("property:og:locale:alternate", []))
    en_alt_locs = set(en_meta.get("property:og:locale:alternate", []))
    if pl_loc and en_loc:
        if pl_alt_locs and en_loc not in pl_alt_locs:
            errors.append(
                f"[SEO/OG] {pl_rel}: `og:locale:alternate` ({sorted(pl_alt_locs)}) nie wskazuje na EN `og:locale` ({en_loc!r})."
            )
        if en_alt_locs and pl_loc not in en_alt_locs:
            errors.append(
                f"[SEO/OG] {en_rel}: `og:locale:alternate` ({sorted(en_alt_locs)}) nie wskazuje na PL `og:locale` ({pl_loc!r})."
            )


# ---------------------------------------------------------------------------
# Section D: Competition Partition Invariants, Chapter 02 Deep KPIs & MD Docs
# ---------------------------------------------------------------------------


def _validate_kpi_invariants(kpis: dict[str, Any], errors: list[str]) -> None:
    """Asserts exact grosz and contract-count partition invariants across competition tiers and cliffs."""
    comp = kpis["competition"]
    tiers: dict[str, CompetitionTierKpi] = comp["tiers"]
    cliff: dict[str, CompetitionSliceKpi] = comp["cliff_170k"]
    eu_comp: dict[str, CompetitionSliceKpi] = comp["eu_vs_non_eu"]

    partition_sum = (
        tiers["single_bid"].sum_pln
        + tiers["sole_source"].sum_pln
        + tiers["bids_2_3"].sum_pln
        + tiers["bids_4_plus"].sum_pln
    )
    if partition_sum != kpis["core_sum_pln"]:
        errors.append(
            f"[KPI inwariant] Suma kwot koszyków konkurencji ({fmt_exact_pln(partition_sum, 'pl')}) "
            f"!= łączna kwota umów podstawowych ({fmt_exact_pln(kpis['core_sum_pln'], 'pl')})."
        )

    partition_count = (
        tiers["single_bid"].signed_count
        + tiers["sole_source"].signed_count
        + tiers["bids_2_3"].signed_count
        + tiers["bids_4_plus"].signed_count
    )
    if partition_count != kpis["core_signed_count"]:
        errors.append(
            f"[KPI inwariant] Suma liczby umów w koszykach konkurencji ({partition_count}) "
            f"!= liczba podpisanych umów podstawowych ({kpis['core_signed_count']})."
        )

    zr_expected_sum = tiers["single_bid"].sum_pln + tiers["sole_source"].sum_pln
    if tiers["zero_rival"].sum_pln != zr_expected_sum:
        errors.append(
            f"[KPI inwariant] `zero_rival` suma ({fmt_exact_pln(tiers['zero_rival'].sum_pln, 'pl')}) "
            f"!= `single_bid + sole_source` ({fmt_exact_pln(zr_expected_sum, 'pl')})."
        )

    cliff_count = cliff["below_170k"].with_bids_count + cliff["at_or_above_170k"].with_bids_count
    if cliff_count != comp["with_bids_count"]:
        errors.append(
            f"[KPI inwariant] Suma liczby umów poniżej i od progu 170 tys. zł ({cliff_count}) "
            f"!= liczba konkurencyjnych umów podstawowych ({comp['with_bids_count']})."
        )

    cliff_sum = cliff["below_170k"].sum_pln + cliff["at_or_above_170k"].sum_pln
    if cliff_sum != comp["competitive_sum_pln"]:
        errors.append(
            f"[KPI inwariant] Suma kwot poniżej i od progu 170 tys. zł ({fmt_exact_pln(cliff_sum, 'pl')}) "
            f"!= suma konkurencyjnych umów podstawowych ({fmt_exact_pln(comp['competitive_sum_pln'], 'pl')})."
        )

    eu_comp_count = eu_comp["eu"].with_bids_count + eu_comp["non_eu"].with_bids_count
    if eu_comp_count != comp["with_bids_count"]:
        errors.append(
            f"[KPI inwariant] Suma liczby konkurencyjnych umów UE + poza UE ({eu_comp_count}) "
            f"!= liczba konkurencyjnych umów podstawowych ({comp['with_bids_count']})."
        )

    # Cancellation & concluded partition invariants
    canc = kpis["cancellations"]
    c_core: CancellationGroupKpi = canc["core"]
    if c_core.concluded_count != c_core.resolved_count + c_core.cancelled_count:
        errors.append(
            f"[KPI inwariant] `concluded_count` w core ({c_core.concluded_count}) "
            f"!= `resolved + cancelled` ({c_core.resolved_count + c_core.cancelled_count})."
        )
    if c_core.concluded_count + c_core.open_or_pending_count != kpis["core_count"]:
        errors.append(
            f"[KPI inwariant] `concluded + open_or_pending` w core "
            f"({c_core.concluded_count + c_core.open_or_pending_count}) != `core_count` ({kpis['core_count']})."
        )
    sec_canc_sum = sum(s.cancelled_count for s in canc["by_sector"].values())
    sec_concl_sum = sum(s.concluded_count for s in canc["by_sector"].values())
    if sec_canc_sum != c_core.cancelled_count or sec_concl_sum != c_core.concluded_count:
        errors.append(
            f"[KPI inwariant] Niespójność sumy sektorowej unieważnień/zakończonych "
            f"({sec_canc_sum}/{sec_concl_sum}) względem core ({c_core.cancelled_count}/{c_core.concluded_count})."
        )

    # 2026 quarterly & H1 healthcare partition invariants
    temp = kpis["temporal"]
    q2026: dict[str, QuarterKpi] = temp["quarters_2026"]
    ny2026: YearKpi = kpis["notice_years"]["2026"]
    q_proc_sum = sum(q.proc_count for q in q2026.values())
    q_signed_sum = sum(q.signed_count for q in q2026.values())
    q_pln_sum = sum((q.sum_pln for q in q2026.values()), Decimal("0"))
    if q_proc_sum != ny2026.proc_count or q_signed_sum != ny2026.signed_count or q_pln_sum != ny2026.sum_pln:
        errors.append(
            f"[KPI inwariant] Suma kwartałów 2026 ({q_proc_sum} post., {q_signed_sum} umów, "
            f"{fmt_exact_pln(q_pln_sum, 'pl')}) != roczny wynik 2026 ({ny2026.proc_count} post., "
            f"{ny2026.signed_count} umów, {fmt_exact_pln(ny2026.sum_pln, 'pl')})."
        )

    hc_h1 = temp["hc_2026_h1"]
    q_h1_hc_proc = q2026["2026-Q1"].hc_proc_count + q2026["2026-Q2"].hc_proc_count
    if q_h1_hc_proc != hc_h1["h1_proc_count"]:
        errors.append(
            f"[KPI inwariant] Suma postępowań szpitalnych Q1+Q2 2026 ({q_h1_hc_proc}) "
            f"!= `hc_2026_h1.h1_proc_count` ({hc_h1['h1_proc_count']})."
        )
    if not (0 <= hc_h1["h1_zero_rival_count"] <= hc_h1["h1_signed_count"] <= hc_h1["hc_total_signed_count"]):
        errors.append(
            f"[KPI inwariant] Niespójność liczebności fali szpitalnej H1 2026: "
            f"zero_rival={hc_h1['h1_zero_rival_count']}, signed_h1={hc_h1['h1_signed_count']}, "
            f"total_hc={hc_h1['hc_total_signed_count']}."
        )
    if hc_h1["h1_sum_pln"] > hc_h1["hc_total_sum_pln"]:
        errors.append(
            f"[KPI inwariant] Suma umów szpitalnych H1 2026 ({fmt_exact_pln(hc_h1['h1_sum_pln'], 'pl')}) "
            f"> łączna suma ochrony zdrowia ({fmt_exact_pln(hc_h1['hc_total_sum_pln'], 'pl')})."
        )


def _validate_report_competition_prose(
    rel_path: str,
    lang: str,
    doc: HtmlNode,
    kpis: dict[str, Any],
    errors: list[str],
) -> None:
    """Validates Chapter 02 (#konkurencja / #competition) deep competition KPIs in PL and EN reports."""
    section_id = "konkurencja" if lang == "pl" else "competition"
    sec = doc.find_one(attr_id=section_id)
    if sec is None:
        errors.append(f"[HTML KPI] {rel_path}: brak sekcji rozdziału 02 `#{section_id}`.")
        return

    # Normalize inline text without inserting spaces inside <strong>56,0</strong>%
    txt = re.sub(r"\s+", " ", sec.text(sep="")).strip()
    comp = kpis["competition"]
    sw_zr = comp["software_zero_rival"]
    cliff: dict[str, CompetitionSliceKpi] = comp["cliff_170k"]

    pct_unit = r"(?:%|procent\b)" if lang == "pl" else r"(?:%|per\s*cent\b)"

    zr_pct_s = fmt_num(comp["zero_rival_spend_pct"], 1, lang)
    zr_mln_s = fmt_mln_num(comp["zero_rival_sum_pln"], lang)
    sw_zr_pct_s = fmt_num(sw_zr["zero_rival_spend_pct"], 1, lang)
    below_sb_pct_s = fmt_num(cliff["below_170k"].single_bid_pct, 1, lang)
    above_sb_pct_s = fmt_num(cliff["at_or_above_170k"].single_bid_pct, 1, lang)

    if not re.search(rf"(?<!\d){re.escape(zr_pct_s)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML KPI] {rel_path} `#{section_id}`: brak udziału kwotowego umów bez konkurenta "
            f"(`zero_rival` = `{zr_pct_s}%`)."
        )
    if not re.search(rf"(?<!\d){re.escape(zr_mln_s)}(?!\d)", txt):
        errors.append(
            f"[HTML KPI] {rel_path} `#{section_id}`: brak kwoty umów bez konkurenta w mln "
            f"(`zero_rival` = `{zr_mln_s}`)."
        )
    if not re.search(rf"(?<!\d){re.escape(sw_zr_pct_s)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML KPI] {rel_path} `#{section_id}`: brak udziału kwotowego umów bez konkurenta "
            f"we wdrożeniach oprogramowania (`software zero_rival` = `{sw_zr_pct_s}%`)."
        )
    if not re.search(rf"(?<!\d){re.escape(below_sb_pct_s)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML KPI] {rel_path} `#{section_id}`: brak odsetka 1 oferty poniżej progu 170 tys. zł "
            f"(`below_170k` = `{below_sb_pct_s}%`)."
        )
    if not re.search(rf"(?<!\d){re.escape(above_sb_pct_s)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML KPI] {rel_path} `#{section_id}`: brak odsetka 1 oferty od progu 170 tys. zł wzwyż "
            f"(`at_or_above_170k` = `{above_sb_pct_s}%`)."
        )


def _validate_report_forensic_prose(
    rel_path: str,
    lang: str,
    doc: HtmlNode,
    kpis: dict[str, Any],
    errors: list[str],
) -> None:
    """Validates Wave 2 forensic BZP protocol & temporal KPIs across Chapters 02 and 03."""
    sec_ids = ("konkurencja", "wykonawcy") if lang == "pl" else ("competition", "vendors")
    secs: list[HtmlNode] = []
    for sid in sec_ids:
        el = doc.find_one(attr_id=sid)
        if el is None:
            errors.append(f"[HTML KPI] {rel_path}: brak sekcji `#{sid}`.")
        else:
            secs.append(el)
    if not secs:
        return

    txt = " ".join(re.sub(r"\s+", " ", s.text(sep="")).strip() for s in secs)
    scope_lbl = " / ".join(f"#{sid}" for sid in sec_ids)
    pct_unit = r"(?:%|procent\b)" if lang == "pl" else r"(?:%|per\s*cent\b)"
    fb = FORENSIC_HTML_BENCHMARKS
    c_core: CancellationGroupKpi = kpis["cancellations"]["core"]
    hc_h1 = kpis["temporal"]["hc_2026_h1"]

    # 1. Effective zero-surviving-rival share: 60.7% and 19.54M PLN (59 of 110 after 26.3% rejections + 10 sole-source worth 3.46M)
    eff_zr_pct = fmt_num(fb["effective_zero_rival_spend_pct"], 1, lang)
    eff_zr_mln = fmt_num(fb["effective_zero_rival_sum_mln"], 2, lang)
    eff_zr_cnt = fb["effective_zero_rival_contracts"]
    rej_rate_s = fmt_num(fb["bid_rejection_rate_pct"], 1, lang)
    stat_ss_mln = fmt_num(fb["statutory_sole_source_sum_mln"], 2, lang)
    if not re.search(rf"(?<!\d){re.escape(eff_zr_pct)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak efektywnego udziału kwotowego bez rywala "
            f"po odrzuceniach ofert (`{eff_zr_pct}%`)."
        )
    if not re.search(rf"(?<!\d){re.escape(eff_zr_mln)}(?!\d)", txt):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak efektywnej kwoty bez rywala w mln "
            f"(`{eff_zr_mln}`)."
        )
    if not re.search(rf"(?<!\d){eff_zr_cnt}(?!\d)", txt):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak liczby `{eff_zr_cnt}` podpisanych umów "
            f"bez ocalałego konkurenta."
        )
    if not re.search(rf"(?<!\d){re.escape(rej_rate_s)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak odsetka odrzuconych ofert (`{rej_rate_s}%`)."
        )
    if not re.search(rf"(?<!\d){re.escape(stat_ss_mln)}(?!\d)", txt):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak łącznej kwoty ustawowej wolnej ręki w mln "
            f"(`{stat_ss_mln}`)."
        )

    # 2. Zero substantive quality criteria: 72.2% in AI software and 63.5% overall
    zq_sw = fmt_num(fb["zero_quality_criteria_software_pct"], 1, lang)
    zq_all = fmt_num(fb["zero_quality_criteria_overall_pct"], 1, lang)
    if not re.search(rf"(?<!\d){re.escape(zq_sw)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak odsetka postępowań software bez "
            f"merytorycznych kryteriów jakości (`{zq_sw}%`)."
        )
    if not re.search(rf"(?<!\d){re.escape(zq_all)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak ogólnego odsetka postępowań bez "
            f"merytorycznych kryteriów jakości (`{zq_all}%`)."
        )

    # 3. Price compression vs net estimate: 54.0% (or 46.0% / 46% discount) vs 100.0%
    p_crowd = fmt_num(fb["price_vs_estimate_crowded_pct"], 1, lang)
    p_disc_1 = fmt_num(fb["price_discount_crowded_pct"], 1, lang)
    p_disc_0 = str(round_int(fb["price_discount_crowded_pct"]))
    p_zero = fmt_num(fb["price_vs_estimate_zero_rival_pct"], 1, lang)
    has_crowd_comp = bool(
        re.search(rf"(?<!\d){re.escape(p_crowd)}\s*{pct_unit}", txt, re.I)
        or re.search(rf"(?<!\d){re.escape(p_disc_1)}\s*{pct_unit}", txt, re.I)
        or re.search(rf"(?<!\d){re.escape(p_disc_0)}\s*{pct_unit}", txt, re.I)
    )
    if not has_crowd_comp:
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak wskaźnika kompresji ceny wobec szacunku "
            f"przy wielu ofertach (`{p_crowd}%` lub `{p_disc_1}%` / `{p_disc_0}%` obniżki)."
        )
    if not re.search(rf"(?<!\d){re.escape(p_zero)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak mediany relacji ceny do szacunku "
            f"przy braku konkurencji (`{p_zero}%`)."
        )

    # 4. Cancelled tenders statutory breakdown: 22.0% (31 of 141 concluded), 45.2% (14 of 31 budget shock),
    #    and at least 53 bids across 24 cancelled tenders (explicitly flagging stale 61)
    canc_concl_pct = fmt_num(c_core.cancelled_pct_concluded, 1, lang)
    bshock_pct = fmt_num(fb["cancelled_budget_shock_pct"], 1, lang)
    min_canc_bids = fb["cancelled_min_bids"]
    stale_canc_bids = fb["cancelled_stale_bids"]
    if not re.search(rf"(?<!\d){re.escape(canc_concl_pct)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak odsetka unieważnień wśród zakończonych "
            f"postępowań core (`{canc_concl_pct}%`, tj. {c_core.cancelled_count} ze {c_core.concluded_count})."
        )
    if not re.search(rf"(?<!\d){re.escape(bshock_pct)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak udziału przekroczenia budżetu wśród "
            f"unieważnień (`{bshock_pct}%`, tj. {fb['cancelled_budget_shock_count']} z {c_core.cancelled_count})."
        )
    if lang == "pl":
        if re.search(rf"(?<![\d,\.]){stale_canc_bids}\+?\s*ofert(?:y|ach|ami|om)?\b", txt, re.I):
            errors.append(
                f"[HTML forensic] {rel_path} ({scope_lbl}): nieaktualna liczba `{stale_canc_bids} ofert` "
                f"w unieważnionych postępowaniach (powinno być co najmniej `{min_canc_bids} oferty`)."
            )
        if not re.search(rf"(?<![\d,\.]){min_canc_bids}\+?\s*ofert(?:y|ach|ami|om)?\b", txt, re.I):
            errors.append(
                f"[HTML forensic] {rel_path} ({scope_lbl}): brak zweryfikowanej dolnej granicy "
                f"`{min_canc_bids} oferty` / `{min_canc_bids}+ ofert` w unieważnionych postępowaniach."
            )
    else:
        if re.search(rf"(?<![\d,\.]){stale_canc_bids}\+?\s*bids\b", txt, re.I):
            errors.append(
                f"[HTML forensic] {rel_path} ({scope_lbl}): nieaktualna liczba `{stale_canc_bids} bids` "
                f"w unieważnionych postępowaniach (powinno być `at least {min_canc_bids} bids`)."
            )
        if not re.search(rf"(?<![\d,\.]){min_canc_bids}\+?\s*bids\b", txt, re.I):
            errors.append(
                f"[HTML forensic] {rel_path} ({scope_lbl}): brak zweryfikowanej dolnej granicy "
                f"`{min_canc_bids} bids` / `{min_canc_bids}+ bids` w unieważnionych postępowaniach."
            )

    # 5. H1 2026 healthcare zero-rival rate: 84.2% (16 of 19), 26 of 38 (68.4%), and Q3 2026 single-bid 0.0% (0 of 11)
    hc_zr_pct = fmt_num(hc_h1["h1_zero_rival_pct"], 1, lang)
    hc_proc_pct = fmt_num(hc_h1["h1_proc_pct_of_hc"], 1, lang)
    q3_kpi: QuarterKpi = kpis["temporal"]["quarters_2026"]["2026-Q3"]
    q3_sb_pct = fmt_num(q3_kpi.single_bid_pct, 1, lang)
    if not re.search(rf"(?<!\d){re.escape(hc_zr_pct)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak odsetka umów szpitalnych bez konkurenta "
            f"w H1 2026 (`{hc_zr_pct}%`, tj. {hc_h1['h1_zero_rival_count']} z {hc_h1['h1_signed_count']})."
        )
    if not re.search(rf"(?<!\d){re.escape(hc_proc_pct)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak udziału H1 2026 w postępowaniach "
            f"ochrony zdrowia (`{hc_proc_pct}%`, tj. {hc_h1['h1_proc_count']} z {hc_h1['hc_total_proc_count']})."
        )
    if not re.search(rf"(?<!\d){re.escape(q3_sb_pct)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak spadku odsetka 1 oferty w 2026-Q3 "
            f"do `{q3_sb_pct}%` (`0 z {q3_kpi.with_bids_count}`)."
        )

    # 6. SME (MŚP) share: 93.8% of spend (95.5% of contracts)
    sme_spend_s = fmt_num(fb["sme_spend_pct"], 1, lang)
    sme_cnt_s = fmt_num(fb["sme_contracts_pct"], 1, lang)
    if not re.search(rf"(?<!\d){re.escape(sme_spend_s)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak udziału MŚP (SME) w kwocie umów (`{sme_spend_s}%`)."
        )
    if not re.search(rf"(?<!\d){re.escape(sme_cnt_s)}\s*{pct_unit}", txt, re.I):
        errors.append(
            f"[HTML forensic] {rel_path} ({scope_lbl}): brak udziału MŚP (SME) w liczbie umów (`{sme_cnt_s}%`)."
        )


def _extract_json_notice_uuids(records: list[dict[str, Any]]) -> set[str]:
    """Collects all verified 36-char BZP notice UUIDs from JSON (`id`, `url`, `contractNoticeUrl`)."""
    raw_uuid_re = re.compile(r"^08d[0-9a-f]{5}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
    uuids: set[str] = set()
    for r in records:
        rid = str(r.get("id") or "").strip().lower()
        if raw_uuid_re.match(rid):
            uuids.add(rid)
        for key in ("url", "contractNoticeUrl"):
            val = str(r.get(key) or "").strip()
            m = BZP_NOTICE_URL_SCAN_RE.search(val)
            if m:
                uuids.add(m.group(1).lower())
    return uuids


def _validate_html_bzp_urls(
    rel_path: str,
    raw_html: str,
    doc: HtmlNode,
    known_json_uuids: set[str],
    errors: list[str],
) -> None:
    """Validates every ezamowienia.gov.pl URL and BZP notice UUID in an HTML file."""
    allowed_uuids = known_json_uuids | set(VERIFIED_COMPANION_NOTICE_UUIDS.keys())
    checked_hrefs: set[str] = set()

    for el in doc.iter_elements():
        if "href" not in el.attrs:
            continue
        href = el.attrs["href"].strip()
        if "ezamowienia.gov.pl" not in href.lower():
            continue
        checked_hrefs.add(href)
        if href in ALLOWED_EZAMOWIENIA_NON_NOTICE_URLS:
            continue
        m = BZP_NOTICE_URL_RE.match(href)
        if not m:
            errors.append(
                f"[HTML URL] {rel_path}:{el.line}: nieprawidłowy format adresu ezamowienia.gov.pl: {href!r} "
                f"(wymagane `{BZP_URL_PREFIX}08d...` z 36-znakowym małym hex UUID)."
            )
            continue
        uid = m.group(1).lower()
        if uid not in allowed_uuids:
            errors.append(
                f"[HTML BZP UUID] {rel_path}:{el.line}: niezweryfikowany UUID ogłoszenia BZP `{uid}` "
                f"(brak w `bzp-ai-2024-2026.json` oraz `VERIFIED_COMPANION_NOTICE_UUIDS`)."
            )

    for raw_u in re.findall(r"https?://[^\s\)\]>\"'`<]+", raw_html):
        u = raw_u.rstrip(".,;:!?")
        if "ezamowienia.gov.pl" not in u.lower() or u in checked_hrefs:
            continue
        if u in ALLOWED_EZAMOWIENIA_NON_NOTICE_URLS:
            continue
        m = BZP_NOTICE_URL_RE.match(u)
        if not m:
            errors.append(
                f"[HTML URL] {rel_path}: nieprawidłowy format adresu ezamowienia.gov.pl: {u!r} "
                f"(wymagane `{BZP_URL_PREFIX}08d...` z 36-znakowym małym hex UUID)."
            )
            continue
        uid = m.group(1).lower()
        if uid not in allowed_uuids:
            errors.append(
                f"[HTML BZP UUID] {rel_path}: niezweryfikowany UUID ogłoszenia BZP `{uid}` "
                f"(brak w `bzp-ai-2024-2026.json` oraz `VERIFIED_COMPANION_NOTICE_UUIDS`)."
            )


def _extract_ezamowienia_urls_from_md(raw_md: str) -> list[str]:
    candidates: list[str] = []
    for raw_u in re.findall(r"https?://[^\s\)\]>\"'`<]+", raw_md):
        u = raw_u.rstrip(".,;:!?")
        if "ezamowienia.gov.pl" in u.lower():
            candidates.append(u)
    for md_target in re.findall(r"\]\(\s*([^\s\)\"']+)", raw_md):
        u = md_target.strip("<>").rstrip(".,;:!?")
        if "ezamowienia.gov.pl" in u.lower() and not u.lower().startswith(("http://", "https://")):
            candidates.append(u)
    return candidates


def _validate_markdown_docs(
    repo_root: Path,
    kpis: dict[str, Any],
    known_json_uuids: set[str],
    errors: list[str],
) -> None:
    """Validates editorial Markdown docs (existence, BZP URLs + UUIDs, and key KPIs)."""
    exp_core_mln_pl = fmt_mln(kpis["core_sum_pln"], "pl")
    exp_zr_pct_pl = fmt_num(kpis["competition"]["zero_rival_spend_pct"], 1, "pl")
    exp_eff_zr_pct_pl = fmt_num(FORENSIC_HTML_BENCHMARKS["effective_zero_rival_spend_pct"], 1, "pl")
    min_canc_bids = FORENSIC_HTML_BENCHMARKS["cancelled_min_bids"]
    stale_canc_bids = FORENSIC_HTML_BENCHMARKS["cancelled_stale_bids"]
    allowed_uuids = known_json_uuids | set(VERIFIED_COMPANION_NOTICE_UUIDS.keys())

    for rel_md in MD_REPORT_FILES:
        fpath = repo_root / Path(rel_md)
        if not fpath.is_file():
            errors.append(f"[MD plik] Brak wymaganego pliku dokumentacji: `{rel_md}`.")
            continue

        raw_md = fpath.read_text(encoding="utf-8")
        if not raw_md.strip():
            errors.append(f"[MD plik] Plik dokumentacji jest pusty: `{rel_md}`.")
            continue

        for u in _extract_ezamowienia_urls_from_md(raw_md):
            if u in ALLOWED_EZAMOWIENIA_NON_NOTICE_URLS:
                continue
            m = BZP_NOTICE_URL_RE.match(u)
            if not m:
                errors.append(
                    f"[MD URL] {rel_md}: nieprawidłowy format adresu ezamowienia.gov.pl: {u!r} "
                    f"(wymagane `{BZP_URL_PREFIX}08d...` z 36-znakowym hex UUID)."
                )
                continue
            uid = m.group(1).lower()
            if uid not in allowed_uuids:
                errors.append(
                    f"[MD BZP UUID] {rel_md}: niezweryfikowany UUID ogłoszenia BZP `{uid}` "
                    f"(brak w `bzp-ai-2024-2026.json` oraz `VERIFIED_COMPANION_NOTICE_UUIDS`)."
                )

        plain_md = re.sub(
            r"\s+",
            " ",
            re.sub(r"[*_`]", "", raw_md.replace("&nbsp;", " ")),
        ).strip()
        if not re.search(rf"(?<!\d){re.escape(exp_core_mln_pl)}", plain_md):
            errors.append(
                f"[MD KPI] {rel_md}: brak wzmianki o łącznej kwocie umów podstawowych `{exp_core_mln_pl}`."
            )
        if not re.search(rf"(?<!\d){re.escape(exp_zr_pct_pl)}\s*(?:%|procent\b)", plain_md, re.I):
            errors.append(
                f"[MD KPI] {rel_md}: brak wzmianki o udziale kwotowym umów bez konkurenta `{exp_zr_pct_pl}%`."
            )
        if not re.search(rf"(?<!\d){re.escape(exp_eff_zr_pct_pl)}\s*(?:%|procent\b)", plain_md, re.I):
            errors.append(
                f"[MD KPI] {rel_md}: brak wzmianki o efektywnym udziale kwotowym bez konkurenta "
                f"(po odrzuceniach ofert) `{exp_eff_zr_pct_pl}%`."
            )
        if re.search(rf"(?<![\d,\.]){stale_canc_bids}\+?\s*(?:ofert(?:y|ach|ami|om)?|bids)\b", plain_md, re.I):
            errors.append(
                f"[MD KPI] {rel_md}: nieaktualna liczba `{stale_canc_bids}` ofert/bids w unieważnionych "
                f"postępowaniach (powinno być `{min_canc_bids}` / `{min_canc_bids}+`)."
            )
        if not re.search(rf"(?<![\d,\.]){min_canc_bids}\+?\s*(?:ofert(?:y|ach|ami|om)?|bids)\b", plain_md, re.I):
            errors.append(
                f"[MD KPI] {rel_md}: brak zweryfikowanej dolnej granicy `{min_canc_bids}` ofert/bids "
                f"w unieważnionych postępowaniach."
            )


# ---------------------------------------------------------------------------
# Full Gate Orchestrator & CLI
# ---------------------------------------------------------------------------


def run_validation_gate(repo_root: Path, json_path: Path) -> tuple[list[str], dict[str, Any] | None]:
    errors: list[str] = []

    if not json_path.is_file():
        errors.append(f"[JSON plik] Brak pliku danych: `{json_path}`.")
        return errors, None

    try:
        raw_data = json.loads(json_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        errors.append(f"[JSON plik] Błąd składni JSON w `{json_path}`: {exc}.")
        return errors, None

    # A. Schema, logic & hygiene
    records = validate_json_dataset(raw_data, errors)
    if not records:
        return errors, None

    kpis = compute_kpis(records)
    _validate_kpi_invariants(kpis, errors)
    known_sectors = {str(r.get("sector")) for r in records if r.get("sector")}
    known_provinces = {str(r.get("province")) for r in records if r.get("province")}
    known_json_uuids = _extract_json_notice_uuids(records)

    parsed_html: dict[str, tuple[HtmlNode, list[tuple[str, int]], dict[str, list[str]], str]] = {}
    for rel in HTML_FILES:
        fpath = repo_root / Path(rel)
        if not fpath.is_file():
            errors.append(f"[HTML plik] Brak wymaganego pliku HTML: `{rel}`.")
            continue
        raw_html = fpath.read_text(encoding="utf-8")
        doc, id_occ = parse_html_file(fpath)
        meta_map = _extract_meta_map(doc)
        parsed_html[rel] = (doc, id_occ, meta_map, raw_html)

    # B. KPI consistency across the 6 HTML files
    pl_rep = "pl/lab/przetargi-ai/index.html"
    en_rep = "en/lab/ai-tenders/index.html"

    findings_info: dict[str, dict[str, Any]] = {}
    noscript_basis: dict[str, str | None] = {}
    vendor_tables: dict[str, list[tuple[int, int, str]]] = {}

    for rel, lang in ((pl_rep, "pl"), (en_rep, "en")):
        if rel not in parsed_html:
            continue
        doc, _, meta_map, _ = parsed_html[rel]
        findings_info[rel] = _validate_report_findings(rel, lang, doc, kpis, errors)
        _validate_report_meta_descriptions(rel, lang, meta_map, kpis, errors)
        noscript_basis[rel] = _validate_report_noscripts(rel, lang, doc, kpis, errors)
        _validate_report_competition_prose(rel, lang, doc, kpis, errors)
        _validate_report_forensic_prose(rel, lang, doc, kpis, errors)
        vendor_tables[rel] = _validate_fig_vendors(rel, lang, doc, records, kpis, errors)

    # Symmetry of annual basis & #fig-vendors between PL and EN reports
    if pl_rep in findings_info and en_rep in findings_info:
        b_pl = findings_info[pl_rep].get("tile2_basis")
        b_en = findings_info[en_rep].get("tile2_basis")
        if b_pl and b_en and b_pl != b_en:
            errors.append(
                f"[HTML KPI] Niespójna podstawa roczna w kafelku #2 `.lab-findings`: PL={b_pl!r} vs EN={b_en!r}."
            )
    if noscript_basis.get(pl_rep) and noscript_basis.get(en_rep):
        if noscript_basis[pl_rep] != noscript_basis[en_rep]:
            errors.append(
                f"[HTML KPI] Niespójna podstawa roczna w `#fig-illusion <noscript>`: "
                f"PL={noscript_basis[pl_rep]!r} vs EN={noscript_basis[en_rep]!r}."
            )
    if vendor_tables.get(pl_rep) and vendor_tables.get(en_rep):
        if vendor_tables[pl_rep] != vendor_tables[en_rep]:
            errors.append(
                f"[HTML KPI] Rozjazd wierszy (liczba umów / kwota / preset) w `#fig-vendors` między PL i EN."
            )

    for rel, lang in (("pl/lab/index.html", "pl"), ("en/lab/index.html", "en")):
        if rel in parsed_html:
            _validate_lab_hub_page(rel, lang, parsed_html[rel][0], kpis, errors)

    for rel, lang in (("pl/index.html", "pl"), ("en/index.html", "en")):
        if rel in parsed_html:
            _validate_home_page(rel, lang, parsed_html[rel][0], kpis, errors)

    # C. Links, presets, anchors, BZP notice UUID integrity & SEO/OG tags
    for rel in HTML_FILES:
        if rel in parsed_html:
            doc, id_occ, _, raw_html = parsed_html[rel]
            _validate_anchors_and_presets(rel, doc, id_occ, known_sectors, known_provinces, errors)
            _validate_html_bzp_urls(rel, raw_html, doc, known_json_uuids, errors)

    if pl_rep in parsed_html and en_rep in parsed_html:
        _validate_report_seo_pair(
            repo_root,
            pl_rep,
            parsed_html[pl_rep][0],
            parsed_html[pl_rep][2],
            en_rep,
            parsed_html[en_rep][0],
            parsed_html[en_rep][2],
            errors,
        )

    # D. Companion Markdown documents (methodology, investigation & press kit)
    _validate_markdown_docs(repo_root, kpis, known_json_uuids, errors)

    return errors, kpis


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    default_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(
        description="Weryfikacja spójności danych, KPI i SEO raportu BZP AI (2024–2026)."
    )
    parser.add_argument(
        "--print-kpis",
        action="store_true",
        help="Wylicz i wypisz wszystkie wskaźniki KPI (PL i EN) z pliku JSON bez uruchamiania śluzy błędów.",
    )
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=default_root,
        help="Ścieżka do katalogu głównego repozytorium.",
    )
    args = parser.parse_args(argv)

    repo_root: Path = args.repo_root.resolve()
    json_path = repo_root / "assets" / "lab" / "bzp-ai-2024-2026.json"

    if args.print_kpis:
        if not json_path.is_file():
            print(f"BŁĄD: Nie znaleziono pliku {json_path}", file=sys.stderr)
            return 1
        raw_data = json.loads(json_path.read_text(encoding="utf-8"))
        if not isinstance(raw_data, list) or not raw_data:
            print(f"BŁĄD: Plik {json_path} nie zawiera niepustej tablicy rekordów.", file=sys.stderr)
            return 1
        kpis = compute_kpis(raw_data)
        print_kpis(kpis)
        return 0

    errors, kpis = run_validation_gate(repo_root, json_path)
    if errors:
        print(f"ŚLUZA JAKOŚCI BZP — NIEPOWODZENIE ({len(errors)} błędów):")
        for idx, err in enumerate(errors, start=1):
            print(f"  {idx:>3d}. {err}")
        return 1

    assert kpis is not None
    print(
        f"ŚLUZA JAKOŚCI BZP — OK (0 błędów) · "
        f"{kpis['all_count']} postępowań ({kpis['core_count']} core, "
        f"{kpis['core_signed_count']} umów, {fmt_mln(kpis['core_sum_pln'], 'pl')} / "
        f"{fmt_mln(kpis['core_sum_pln'], 'en')}) · "
        f"zweryfikowano {len(HTML_FILES)} plików HTML, {len(MD_REPORT_FILES)} dokumenty MD i zasoby OG."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
