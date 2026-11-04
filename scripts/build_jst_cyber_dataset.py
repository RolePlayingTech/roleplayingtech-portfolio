#!/usr/bin/env python3
"""Build verified, Phase-C-reconciled dataset for Issue 03:
'1,48 mld zł na Cyberbezpieczny Samorząd, a poczta urzędów stoi otworem i strony śledzą mieszkańców'
(`assets/lab/jst-cyber-2026.json`).

Applies all 6 mandatory Phase C zero-tolerance patches:
  1. Clears false `county_gmw_exact` CPPC join on `1602023 Gmina Branice`.
  2. Appends the 2 statutory GMW municipalities omitted from MSWiA's XLS (`2613063 Włoszczowa`
     and `1602013 Baborów`) -> 100% coverage of all 2,809 Polish JSTs (2,479 gminy + 314 powiaty
     + 16 województwa) and all 2,511 positive CPPC FERC.02.02 applications.
  3. Patches all 8 `org_fallback` subdomain DMARC records where Phase A read a sibling record.
  4. Patches `2007072 Gmina Śniadowo` (`sekretariat@sniadowo` -> `sniadowo.pl`, DMARC `missing`).
  5. Updates 3 municipalities (`1428062 Rybno`, `2602093 Wodzisław`, `1210073 Krynica-Zdrój`)
     that migrated from legacy MSWiA freemail/ISP addresses to own domains (`quarantine`),
     leaving the exact 30 live-confirmed commercial/ISP freemail municipalities.
  6. Populates live institutional domains (`quarantine`) for the 2 counties left blank in MSWiA's
     email column (`0219000 Powiat Świdnicki` & `0222000 Powiat Wołowski`) while preserving their
     MSWiA-blank flag for denominator sensitivity checks.
"""

from __future__ import annotations

import json
import math
import os
from pathlib import Path
from typing import Any

import pandas as pd
from scipy import stats

ROOT = Path(__file__).resolve().parent.parent
SCRATCH = Path(os.environ.get("RAW_AUDIT_DIR", str(ROOT / "scratch")))
OUT_JSON = ROOT / "assets" / "lab" / "jst-cyber-2026.json"

PATCH_8_SUBDOMAINS: dict[str, tuple[str, str]] = {
    "1603000": ("reject", "v=DMARC1; p=reject; sp=reject"),
    "3012000": ("quarantine", "v=DMARC1; p=quarantine; sp=quarantine"),
    "2609011": ("quarantine", "v=DMARC1; p=quarantine; pct=100"),
    "1808042": ("quarantine", "v=DMARC1; p=quarantine; adkim=r; aspf=r"),
    "1217000": ("quarantine", "v=DMARC1; p=quarantine; sp=quarantine"),
    "2213031": ("reject", "v=DMARC1; p=reject"),
    "2479011": ("reject", "v=DMARC1; p=reject; pct=100"),
    "2801000": ("quarantine", "v=DMARC1; p=quarantine; pct=100"),
}

VOIV_ORDER = [
    "dolnośląskie",
    "kujawsko-pomorskie",
    "lubelskie",
    "lubuskie",
    "łódzkie",
    "małopolskie",
    "mazowieckie",
    "opolskie",
    "podkarpackie",
    "podlaskie",
    "pomorskie",
    "śląskie",
    "świętokrzyskie",
    "warmińsko-mazurskie",
    "wielkopolskie",
    "zachodniopomorskie",
]

TYPE_ORDER = ["W", "MNP", "P", "GM", "GMW", "GW"]


def clean_str(val: Any) -> str:
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return ""
    s = str(val).strip()
    return "" if s.lower() == "nan" else s


def clean_bool(val: Any) -> bool:
    if isinstance(val, bool):
        return val
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return False
    return str(val).strip().lower() in ("true", "1", "yes")


def clean_float(val: Any, default: float = 0.0) -> float:
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return default
    try:
        return float(val)
    except (TypeError, ValueError):
        return default


def two_by_two_stats(cs_pos: int, cs_tot: int, nocs_pos: int, nocs_tot: int) -> dict[str, Any]:
    a = cs_pos
    b = cs_tot - cs_pos
    c = nocs_pos
    d = nocs_tot - nocs_pos
    chi2_y, p_y, _, _ = stats.chi2_contingency([[a, b], [c, d]], correction=True)
    odds_r, p_f = stats.fisher_exact([[a, b], [c, d]])
    tot = cs_tot + nocs_tot
    pos = a + c
    return {
        "totalN": tot,
        "positiveN": pos,
        "positivePct": round(pos / tot * 100, 2),
        "csN": cs_tot,
        "csPosN": a,
        "csPosPct": round(a / cs_tot * 100, 2),
        "noCsN": nocs_tot,
        "noCsPosN": c,
        "noCsPosPct": round(c / nocs_tot * 100, 2),
        "diffPp": round((a / cs_tot - c / nocs_tot) * 100, 2),
        "chi2Yates": round(float(chi2_y), 4),
        "pYates": round(float(p_y), 4),
        "pFisher": round(float(p_f), 4),
        "oddsRatio": round(float(odds_r), 4),
    }


def main() -> None:
    df_raw = pd.read_csv(
        SCRATCH / "phase_a" / "exp_02" / "data" / "jst_2807_master_final.csv",
        dtype={"teryt7": str, "cppc_teryt7": str},
    )
    assert len(df_raw) == 2807, f"Expected 2807 MSWiA rows, got {len(df_raw)}"

    df_pw = pd.read_csv(
        SCRATCH / "phase_b" / "b1_cyber_jst" / "data" / "playwright_zero_click_audit_stealth_final.csv",
        dtype={"teryt7": str, "meta_pixel_ids": str},
    )
    df_lev = pd.read_csv(
        SCRATCH / "phase_b" / "b1_cyber_jst" / "data" / "live_email_verification_final.csv",
        dtype={"teryt7": str},
    )
    df_gov_sec = pd.read_csv(
        SCRATCH / "phase_b" / "b1_cyber_jst" / "data" / "gov_pl_1124_by_sector.csv"
    )
    df_gov_all = pd.read_csv(
        SCRATCH / "phase_a" / "exp_02" / "data" / "gov_pl_1395_dns_final.csv"
    )
    df_cppc_cat = pd.read_csv(
        SCRATCH / "phase_b" / "b1_cyber_jst" / "data" / "cppc_ranking_vs_signed_contracts.csv"
    )

    # Compute Phase-A unpatched sensitivity reference (N=2,773) before applying patches
    inst_unpatched = df_raw[
        df_raw["email_domain_type"].isin(["own_institutional_domain", "gov_pl", "shared_municipal_hub"])
    ].copy()
    inst_unpatched["no_dmarc_u"] = (
        inst_unpatched["dmarc_effective_policy"].isin(["missing", "malformed_multiple"])
        | inst_unpatched["dmarc_effective_policy"].isna()
    )
    inst_unpatched["spoof_u"] = inst_unpatched["no_dmarc_u"] | (
        inst_unpatched["dmarc_effective_policy"] == "none"
    )

    # Copy for Phase-C patching
    df = df_raw.copy()
    for col in ("nazwa_samorządu", "Województwo", "Powiat", "typ_JST", "nazwa_urzędu_JST"):
        df[col] = df[col].map(clean_str)
    df["Województwo"] = df["Województwo"].str.lower()
    df["mswia_omitted"] = False
    df["mswia_email_blank"] = df["email_domain_type"] == "missing_email"
    df["patch_note"] = ""

    # PATCH 1: Clear false county_gmw_exact join on 1602023 Gmina Branice
    m_branice = df["teryt7"] == "1602023"
    assert int(m_branice.sum()) == 1
    df.loc[
        m_branice,
        [
            "has_cs_grant",
            "cppc_grant_pln",
            "cppc_total_cost_pln",
            "cppc_eu_pln",
            "cppc_own_pln",
            "cppc_bp_pln",
            "cppc_lp",
            "cppc_grant_name",
            "cppc_teryt7",
            "cppc_app_no",
            "join_method",
            "patch_note",
        ],
    ] = [False, 0.0, 0.0, 0.0, 0.0, 0.0, None, "", "", "", "none", "cleared_false_county_gmw_join"]

    # PATCH 3: Fix 8 org_fallback subdomain DMARC records
    for t7, (pol, raw_rec) in PATCH_8_SUBDOMAINS.items():
        m = df["teryt7"] == t7
        assert int(m.sum()) == 1, f"Missing subdomain patch TERYT {t7}"
        df.loc[m, "dmarc_effective_policy"] = pol
        df.loc[m, "dmarc_status"] = "present"
        df.loc[m, "dmarc_raw"] = raw_rec
        df.loc[m, "patch_note"] = "patched_rfc7489_org_domain_inheritance"

    # PATCH 4: Fix 2007072 Gmina Śniadowo (`sekretariat@sniadowo` -> `sniadowo.pl`, missing DMARC)
    m_sniad = df["teryt7"] == "2007072"
    assert int(m_sniad.sum()) == 1
    df.loc[
        m_sniad,
        [
            "primary_email",
            "email_domain",
            "domain",
            "org_domain",
            "has_mx",
            "mx_primary",
            "spf_status",
            "spf_all_policy",
            "dmarc_status",
            "dmarc_effective_policy",
            "patch_note",
        ],
    ] = [
        "sekretariat@sniadowo.pl",
        "sniadowo.pl",
        "sniadowo.pl",
        "sniadowo.pl",
        True,
        "poczta.hi.pl",
        "present",
        "-all",
        "missing",
        "missing",
        "patched_mswia_missing_pl_tld",
    ]

    # PATCH 5: Update 3 municipalities that migrated from legacy MSWiA freemail/ISP to own domain
    migrated_specs = [
        ("1428062", "sekretariat@gminarybno.com", "gminarybno.com", "quarantine", 100.0, "migrated_from_mswia_wp_pl"),
        ("2602093", "sekretariat@ugwodzislaw.pl", "ugwodzislaw.pl", "quarantine", 10.0, "migrated_from_mswia_wp_pl"),
        ("1210073", "krynica@umkrynica.pl", "umkrynica.pl", "quarantine", 100.0, "migrated_from_mswia_ns_onet_pl"),
    ]
    for t7, em, dom, pol, pct, note in migrated_specs:
        m = df["teryt7"] == t7
        assert int(m.sum()) == 1
        df.loc[
            m,
            [
                "primary_email",
                "email_domain",
                "domain",
                "org_domain",
                "email_domain_type",
                "has_mx",
                "dmarc_status",
                "dmarc_effective_policy",
                "dmarc_pct",
                "patch_note",
            ],
        ] = [em, dom, dom, dom, "own_institutional_domain", True, "present", pol, pct, note]

    # PATCH 6: Populate live verified domains for 2 counties blank in MSWiA's email column
    blank_county_specs = [
        ("0219000", "starostwo@powiat.swidnica.pl", "powiat.swidnica.pl", "powiat.swidnica.pl", "quarantine", "-all"),
        ("0222000", "starostwo@powiatwolowski.pl", "powiatwolowski.pl", "powiatwolowski.pl", "quarantine", "-all"),
    ]
    for t7, em, dom, org_d, pol, spf_pol in blank_county_specs:
        m = df["teryt7"] == t7
        assert int(m.sum()) == 1
        df.loc[
            m,
            [
                "primary_email",
                "email_domain",
                "domain",
                "org_domain",
                "email_domain_type",
                "has_mx",
                "spf_status",
                "spf_all_policy",
                "dmarc_status",
                "dmarc_effective_policy",
                "dmarc_pct",
                "patch_note",
            ],
        ] = [em, dom, dom, org_d, "own_institutional_domain", True, "present", spf_pol, "present", pol, 100.0, "populated_live_domain_mswia_blank"]

    # PATCH 2: Append 2 statutory GMW municipalities omitted from MSWiA's 2026-04-16 XLS
    extra_rows = pd.DataFrame(
        [
            {
                "teryt7": "2613063",
                "Kod_TERYT": "2613063",
                "nazwa_samorządu": "Włoszczowa",
                "Województwo": "świętokrzyskie",
                "Powiat": "włoszczowski",
                "typ_JST": "GMW",
                "nazwa_urzędu_JST": "Urząd Gminy Włoszczowa",
                "miejscowość": "Włoszczowa",
                "primary_email": "gmina@gmina-wloszczowa.pl",
                "email_domain": "gmina-wloszczowa.pl",
                "email_org_domain": "gmina-wloszczowa.pl",
                "email_domain_type": "own_institutional_domain",
                "www_clean": "wloszczowa.pl",
                "cppc_lp": 631,
                "cppc_grant_name": "GMINA WŁOSZCZOWA",
                "cppc_teryt7": "2613063",
                "cppc_app_no": "FERC.02.02-CS.01-001/23/0681",
                "cppc_total_cost_pln": 913978.02,
                "cppc_grant_pln": 850000.00,
                "cppc_grant_pct": 93.0,
                "cppc_eu_pln": 714000.00,
                "cppc_own_pln": 63978.02,
                "cppc_bp_pln": 136000.00,
                "join_method": "teryt6_exact_patched",
                "has_cs_grant": True,
                "domain": "gmina-wloszczowa.pl",
                "org_domain": "gmina-wloszczowa.pl",
                "is_subdomain": False,
                "has_mx": True,
                "mx_primary": "gmina-wloszczowa.pl",
                "spf_status": "present",
                "spf_raw": "v=spf1 mx a ptr ~all",
                "spf_all_policy": "~all",
                "spf_dns_lookups": 3,
                "spf_exceeds_10_lookups": False,
                "dmarc_status": "missing",
                "dmarc_source": "missing",
                "dmarc_raw": "",
                "dmarc_effective_policy": "missing",
                "dmarc_pct": 100.0,
                "dmarc_has_rua": False,
                "dnssec_valid_ad": False,
                "mail_provider_group": "Other Regional Hosting / Self-Hosted",
                "web_reachable": True,
                "https_works_valid_tls": True,
                "final_url": "https://wloszczowa.pl/",
                "final_https": True,
                "hsts": True,
                "csp": False,
                "meta_pixel": False,
                "ga_gtm": False,
                "clarity_hotjar": False,
                "security_txt_valid": False,
                "mswia_omitted": True,
                "mswia_email_blank": False,
                "patch_note": "appended_gus_statutory_gmw_omitted_in_mswia",
            },
            {
                "teryt7": "1602013",
                "Kod_TERYT": "1602013",
                "nazwa_samorządu": "Baborów",
                "Województwo": "opolskie",
                "Powiat": "głubczycki",
                "typ_JST": "GMW",
                "nazwa_urzędu_JST": "Urząd Miejski w Baborowie",
                "miejscowość": "Baborów",
                "primary_email": "um@baborow.pl",
                "email_domain": "baborow.pl",
                "email_org_domain": "baborow.pl",
                "email_domain_type": "own_institutional_domain",
                "www_clean": "baborow.pl",
                "cppc_lp": 760,
                "cppc_grant_name": "GMINA BABORÓW",
                "cppc_teryt7": "1602013",
                "cppc_app_no": "FERC.02.02-CS.01-001/23/0813",
                "cppc_total_cost_pln": 504198.00,
                "cppc_grant_pln": 473947.00,
                "cppc_grant_pct": 94.0,
                "cppc_eu_pln": 393377.00,
                "cppc_own_pln": 30251.00,
                "cppc_bp_pln": 80570.00,
                "join_method": "teryt6_exact_patched",
                "has_cs_grant": True,
                "domain": "baborow.pl",
                "org_domain": "baborow.pl",
                "is_subdomain": False,
                "has_mx": True,
                "mx_primary": "mail.baborow.pl",
                "spf_status": "present",
                "spf_raw": "v=spf1 +a +mx +a:mx01.netkoncept.com -all",
                "spf_all_policy": "-all",
                "spf_dns_lookups": 3,
                "spf_exceeds_10_lookups": False,
                "dmarc_status": "present",
                "dmarc_source": "exact",
                "dmarc_raw": "v=DMARC1; p=reject; rua=mailto:dmarc@reports.netkoncept.com; ruf=mailto:dmarc@reports.netkoncept.com; fo=1;",
                "dmarc_effective_policy": "reject",
                "dmarc_pct": 100.0,
                "dmarc_has_rua": True,
                "dnssec_valid_ad": False,
                "mail_provider_group": "Other Regional Hosting / Self-Hosted",
                "web_reachable": True,
                "https_works_valid_tls": True,
                "final_url": "https://baborow.pl/",
                "final_https": True,
                "hsts": False,
                "csp": False,
                "meta_pixel": False,
                "ga_gtm": False,
                "clarity_hotjar": False,
                "security_txt_valid": False,
                "mswia_omitted": True,
                "mswia_email_blank": False,
                "patch_note": "appended_gus_statutory_gmw_omitted_in_mswia",
            },
        ]
    )
    df = pd.concat([df, extra_rows], ignore_index=True)
    assert len(df) == 2809, f"Expected 2809 Polish JSTs, got {len(df)}"
    assert df["teryt7"].nunique() == 2809, "Duplicate TERYT7!"

    # Merge Playwright Zero-Click stealth Chromium verdicts onto df
    pw_map: dict[str, dict[str, Any]] = {}
    for _, r in df_pw.iterrows():
        t7 = clean_str(r["teryt7"])
        # Prioritize phase_a_meta_350 if duplicate teryt7 exists across cohorts
        if t7 not in pw_map or clean_str(r["pw_cohort"]) == "phase_a_meta_350":
            pw_map[t7] = {
                "cohort": clean_str(r["pw_cohort"]),
                "cls": clean_str(r["zero_click_meta_class"]),
                "anyMeta": clean_bool(r["any_meta_request_zero_click"]),
                "activePixel": clean_bool(r["active_meta_pixel_zero_click"]),
                "advMatchPii": clean_bool(r["meta_advanced_matching_pii"]),
                "fbpCookie": clean_bool(r["cookie_fbp_set"]),
                "gaZeroClick": clean_bool(r["ga_collect_zero_click"]),
                "clarityHotjar": clean_bool(r["clarity_hotjar_zero_click"]),
                "finalUrl": clean_str(r["pw_final_url"]),
            }

    # Merge Live Freemail verification verdicts onto df
    lev_freemail_map: dict[str, dict[str, Any]] = {}
    for _, r in df_lev[df_lev["cohort"] == "freemail_32"].iterrows():
        t7 = clean_str(r["teryt7"])
        verdict = clean_str(r["verification_verdict"])
        if verdict in ("100%_CONFIRMED_ONLY_FREEMAIL_LIVE", "CONFIRMED_FREEMAIL_LIVE_DUAL_WITH_OWN_DOMAIN"):
            lev_freemail_map[t7] = {
                "liveEmail": clean_str(r["live_primary_email"]),
                "verdict": "only_freemail" if verdict == "100%_CONFIRMED_ONLY_FREEMAIL_LIVE" else "dual_with_own",
                "ownDomain": clean_str(r["live_own_domain_if_any"]),
                "ownDmarc": clean_str(r["live_own_domain_dmarc"]),
            }
    assert len(lev_freemail_map) == 30, f"Expected 30 live freemail municipalities, got {len(lev_freemail_map)}"

    # Derived flags on full 2,809 population
    df["has_cs_grant"] = df["has_cs_grant"].map(clean_bool)
    df["cppc_grant_pln"] = df["cppc_grant_pln"].map(clean_float)
    df["is_freemail_live"] = df["email_domain_type"] == "commercial_freemail_or_isp_box"
    assert int(df["is_freemail_live"].sum()) == 30, f"Expected 30 freemail rows, got {int(df['is_freemail_live'].sum())}"

    df["is_institutional_mail"] = ~df["is_freemail_live"]
    assert int(df["is_institutional_mail"].sum()) == 2779

    df["no_dmarc"] = df["is_institutional_mail"] & df["dmarc_effective_policy"].isin(
        ["missing", "malformed_multiple"]
    )
    df["spoofable"] = df["is_institutional_mail"] & df["dmarc_effective_policy"].isin(
        ["missing", "malformed_multiple", "none"]
    )
    df["strict_dmarc"] = df["is_institutional_mail"] & df["dmarc_effective_policy"].isin(
        ["quarantine", "reject"]
    )

    # Check CPPC positive grant counts: 2,510 unique JSTs (since Ostrowiec Św. 2607011 had 2 apps in PDF -> 2,511 apps!)
    cs_jst_n = int(df["has_cs_grant"].sum())
    cs_grant_sum = round(float(df.loc[df["has_cs_grant"], "cppc_grant_pln"].sum()), 2)

    # Primary institutional analysis set: N = 2,779 (all 2,809 statutory JSTs minus 30 commercial/ISP freemails)
    inst = df[df["is_institutional_mail"]].copy()
    cs_inst = inst[inst["has_cs_grant"]]
    nocs_inst = inst[~inst["has_cs_grant"]]

    stat_no_dmarc_2779 = two_by_two_stats(
        int(cs_inst["no_dmarc"].sum()),
        len(cs_inst),
        int(nocs_inst["no_dmarc"].sum()),
        len(nocs_inst),
    )
    stat_spoof_2779 = two_by_two_stats(
        int(cs_inst["spoofable"].sum()),
        len(cs_inst),
        int(nocs_inst["spoofable"].sum()),
        len(nocs_inst),
    )

    # Sensitivity across all 4 denominator variants (proving 100% robustness)
    inst_2777 = inst[~inst["mswia_email_blank"]]
    inst_2775 = inst[(~inst["mswia_email_blank"]) & (~inst["mswia_omitted"])]

    def variant_row(label_pl: str, label_en: str, sub: pd.DataFrame, nod_col: str, spf_col: str) -> dict[str, Any]:
        c_y = sub[sub["has_cs_grant"].map(clean_bool)]
        c_n = sub[~sub["has_cs_grant"].map(clean_bool)]
        s_nd = two_by_two_stats(int(c_y[nod_col].sum()), len(c_y), int(c_n[nod_col].sum()), len(c_n))
        s_sp = two_by_two_stats(int(c_y[spf_col].sum()), len(c_y), int(c_n[spf_col].sum()), len(c_n))
        return {
            "labelPl": label_pl,
            "labelEn": label_en,
            "n": len(sub),
            "noDmarcN": s_nd["positiveN"],
            "noDmarcPct": s_nd["positivePct"],
            "csNoDmarcPct": s_nd["csPosPct"],
            "noCsNoDmarcPct": s_nd["noCsPosPct"],
            "noDmarcPYates": s_nd["pYates"],
            "noDmarcPFisher": s_nd["pFisher"],
            "spoofableN": s_sp["positiveN"],
            "spoofablePct": s_sp["positivePct"],
            "csSpoofablePct": s_sp["csPosPct"],
            "noCsSpoofablePct": s_sp["noCsPosPct"],
            "spoofablePYates": s_sp["pYates"],
        }

    sensitivity_variants = [
        variant_row(
            "Pełna populacja GUS 2 809 JST po weryfikacji live (główna baza)",
            "Full 2,809 statutory JSTs after live verification (primary dataset)",
            inst,
            "no_dmarc",
            "spoofable",
        ),
        variant_row(
            "Pełna populacja 2 809 JST bez 2 starostw z pustym e-mailem w MSWiA",
            "Full 2,809 JSTs excluding 2 MSWiA blank-email counties",
            inst_2777,
            "no_dmarc",
            "spoofable",
        ),
        variant_row(
            "Tylko 2 807 JST z pliku MSWiA po korektach Fazy C",
            "MSWiA 2,807 XLS cohort after Phase C patches",
            inst_2775,
            "no_dmarc",
            "spoofable",
        ),
        variant_row(
            "Surowy skan Fazy A przed korektami subdomen i migracji",
            "Raw Phase A scan before subdomain & migration patches",
            inst_unpatched,
            "no_dmarc_u",
            "spoof_u",
        ),
    ]

    # Breakdown by Grant Tier (across N=2,779 institutional mail domains)
    def assign_tier(row: pd.Series) -> str:
        if not row["has_cs_grant"]:
            return "NO_GRANT"
        g = row["cppc_grant_pln"]
        if g >= 849000:
            return "MAX_850K"
        if g >= 500000:
            return "TIER_500_849K"
        if g >= 300000:
            return "TIER_300_500K"
        return "TIER_UNDER_300K"

    inst["grant_tier"] = inst.apply(assign_tier, axis=1)
    tier_defs = [
        ("MAX_850K", "Maksymalny grant (~850 tys. zł)", "Maximum grant (~850k PLN)"),
        ("TIER_500_849K", "Duży grant (500–849 tys. zł)", "Large grant (500–849k PLN)"),
        ("TIER_300_500K", "Średni grant (300–499 tys. zł)", "Medium grant (300–499k PLN)"),
        ("TIER_UNDER_300K", "Mniejszy grant (do 300 tys. zł)", "Smaller grant (<300k PLN)"),
        ("NO_GRANT", "Brak grantu w programie (grupa kontrolna)", "No Cybersecure grant (control group)"),
    ]
    by_grant_tier = []
    for code, lbl_pl, lbl_en in tier_defs:
        sub = inst[inst["grant_tier"] == code]
        n = len(sub)
        nd = int(sub["no_dmarc"].sum())
        pn = int((sub["dmarc_effective_policy"] == "none").sum())
        sp = int(sub["spoofable"].sum())
        rj = int((sub["dmarc_effective_policy"] == "reject").sum())
        qr = int((sub["dmarc_effective_policy"] == "quarantine").sum())
        g_mln = round(float(sub["cppc_grant_pln"].sum()) / 1e6, 2)
        by_grant_tier.append(
            {
                "code": code,
                "labelPl": lbl_pl,
                "labelEn": lbl_en,
                "n": n,
                "grantSumMln": g_mln,
                "noDmarcN": nd,
                "noDmarcPct": round(nd / n * 100, 2),
                "pNoneN": pn,
                "pNonePct": round(pn / n * 100, 2),
                "spoofableN": sp,
                "spoofablePct": round(sp / n * 100, 2),
                "quarantineN": qr,
                "rejectN": rj,
                "strictPct": round((qr + rj) / n * 100, 2),
            }
        )

    # Breakdown by JST Type (all 2,809 JSTs + institutional DMARC rates)
    type_labels = {
        "W": ("Województwa (urzędy marszałkowskie)", "Voivodeships (Marshal's offices)"),
        "MNP": ("Miasta na prawach powiatu", "Cities with county rights"),
        "P": ("Powiaty ziemskie (starostwa)", "Land counties (starostwa)"),
        "GM": ("Gminy miejskie", "Urban municipalities"),
        "GMW": ("Gminy miejsko-wiejskie", "Urban-rural municipalities"),
        "GW": ("Gminy wiejskie", "Rural municipalities"),
    }
    by_jst_type = []
    for tcode in TYPE_ORDER:
        sub_all = df[df["typ_JST"] == tcode]
        sub_inst = inst[inst["typ_JST"] == tcode]
        n_all = len(sub_all)
        n_inst = len(sub_inst)
        nd = int(sub_inst["no_dmarc"].sum())
        pn = int((sub_inst["dmarc_effective_policy"] == "none").sum())
        sp = int(sub_inst["spoofable"].sum())
        rj = int((sub_inst["dmarc_effective_policy"] == "reject").sum())
        qr = int((sub_inst["dmarc_effective_policy"] == "quarantine").sum())
        fm = int(sub_all["is_freemail_live"].sum())
        by_jst_type.append(
            {
                "code": tcode,
                "labelPl": type_labels[tcode][0],
                "labelEn": type_labels[tcode][1],
                "totalN": n_all,
                "instN": n_inst,
                "freemailN": fm,
                "csGrantN": int(sub_all["has_cs_grant"].sum()),
                "grantSumMln": round(float(sub_all["cppc_grant_pln"].sum()) / 1e6, 2),
                "noDmarcN": nd,
                "noDmarcPct": round(nd / n_inst * 100, 2),
                "pNoneN": pn,
                "pNonePct": round(pn / n_inst * 100, 2),
                "spoofableN": sp,
                "spoofablePct": round(sp / n_inst * 100, 2),
                "strictN": qr + rj,
                "strictPct": round((qr + rj) / n_inst * 100, 2),
                "rejectPct": round(rj / n_inst * 100, 2),
                "dnssecPct": round(int(sub_inst["dnssec_valid_ad"].map(clean_bool).sum()) / n_inst * 100, 2),
            }
        )

    # Breakdown by 16 Voivodeships
    by_voivodeship = []
    for voiv in VOIV_ORDER:
        sub_all = df[df["Województwo"] == voiv]
        sub_inst = inst[inst["Województwo"] == voiv]
        sub_web = sub_all[sub_all["web_reachable"].map(clean_bool)]
        n_all = len(sub_all)
        n_inst = len(sub_inst)
        n_web = len(sub_web)
        nd = int(sub_inst["no_dmarc"].sum())
        pn = int((sub_inst["dmarc_effective_policy"] == "none").sum())
        sp = int(sub_inst["spoofable"].sum())
        fm = int(sub_all["is_freemail_live"].sum())
        tls_bad = int((~sub_web["https_works_valid_tls"].map(clean_bool)).sum())
        meta_st = int(sub_web["meta_pixel"].map(clean_bool).sum())
        by_voivodeship.append(
            {
                "voiv": voiv,
                "totalN": n_all,
                "instN": n_inst,
                "freemailN": fm,
                "csGrantN": int(sub_all["has_cs_grant"].sum()),
                "grantSumMln": round(float(sub_all["cppc_grant_pln"].sum()) / 1e6, 2),
                "noDmarcN": nd,
                "noDmarcPct": round(nd / n_inst * 100, 2),
                "pNoneN": pn,
                "spoofableN": sp,
                "spoofablePct": round(sp / n_inst * 100, 2),
                "strictPct": round((n_inst - sp) / n_inst * 100, 2),
                "dnssecPct": round(int(sub_inst["dnssec_valid_ad"].map(clean_bool).sum()) / n_inst * 100, 2),
                "webReachableN": n_web,
                "brokenTlsN": tls_bad,
                "brokenTlsPct": round(tls_bad / n_web * 100, 2) if n_web else 0.0,
                "metaFootprintN": meta_st,
                "metaFootprintPct": round(meta_st / n_web * 100, 2) if n_web else 0.0,
            }
        )

    # .gov.pl 1,124 active MX mail domains by sector
    gov_sector_en = {
        "Inspekcja Sanitarna (Sanepid)": "Sanitary Inspection (Sanepid)",
        "Urzędy pracy i pomoc społeczna": "Labor offices & social welfare",
        "Administracja terenowa i samorządowa (.gov.pl)": "Regional & municipal offices on .gov.pl",
        "Ministerstwa, agencje centralne i pozostałe .gov.pl": "Ministries, central agencies & other .gov.pl",
        "Inspekcje i nadzory państwowe": "State inspectorates & supervision",
        "Służby mundurowe (Policja/PSP/SG)": "Uniformed services (Police / Fire / Border Guard)",
        "Sądy i Prokuratura": "Courts & Prosecution (centralized MX)",
    }
    gov_sectors = []
    for _, r in df_gov_sec.iterrows():
        s_pl = clean_str(r["sector"])
        gov_sectors.append(
            {
                "sectorPl": s_pl,
                "sectorEn": gov_sector_en.get(s_pl, s_pl),
                "activeMxN": int(r["active_mx_domains_n"]),
                "noDmarcN": int(r["no_dmarc_n"]),
                "noDmarcPct": round(float(r["no_dmarc_pct"]), 2),
                "pNoneN": int(r["p_none_n"]),
                "spoofableN": int(r["spoofable_n"]),
                "spoofablePct": round(float(r["spoofable_pct"]), 2),
                "rejectPct": round(float(r["p_reject_pct"]), 2),
                "dnssecPct": round(float(r["dnssec_pct"]), 2),
            }
        )

    # Mail provider concentration on N=2,779
    prov_counts = inst["mail_provider_group"].fillna("Other Regional Hosting / Self-Hosted").value_counts().to_dict()
    ms_n = int(prov_counts.get("Microsoft 365 / Azure (US)", 0))
    gg_n = int(prov_counts.get("Google Workspace (US)", 0))
    nask_n = int(prov_counts.get("State / Academic Network (NASK/COI/PIONIER)", 0))
    home_n = int(prov_counts.get("home.pl / IONOS", 0))
    nazwa_n = int(prov_counts.get("nazwa.pl (NetArt)", 0))
    ovh_n = int(prov_counts.get("OVHcloud (FR/PL)", 0))

    # Playwright Zero-Click summary (Cohort 1: phase_a_meta_350, Cohort 2: gtm_only_sample_100)
    pw_c1 = df_pw[df_pw["pw_cohort"] == "phase_a_meta_350"]
    pw_c1_reach = pw_c1[pw_c1["pw_reachable"].map(clean_bool)]
    pw_c1_any = pw_c1_reach[pw_c1_reach["any_meta_request_zero_click"].map(clean_bool)]
    pw_c1_px = pw_c1_reach[pw_c1_reach["active_meta_pixel_zero_click"].map(clean_bool)]
    pw_c1_sdk = pw_c1_reach[pw_c1_reach["zero_click_meta_class"] == "ZERO_CLICK_META_SOCIAL_PLUGIN_SDK"]
    pw_c1_gated = pw_c1_reach[pw_c1_reach["zero_click_meta_class"] == "CONSENT_GATED_BLOCKED_BEFORE_CLICK"]

    pw_c2 = df_pw[df_pw["pw_cohort"] == "gtm_only_sample_100"]
    pw_c2_reach = pw_c2[pw_c2["pw_reachable"].map(clean_bool)]
    pw_c2_ga = pw_c2_reach[pw_c2_reach["ga_collect_zero_click"].map(clean_bool)]

    # Delegated security paradox: WWW on samorzad.gov.pl vs own domain
    www_str = df["www_clean"].map(clean_str).str.lower()
    final_str = df["final_url"].map(clean_str).str.lower()
    is_samorzad_portal = www_str.str.contains("samorzad.gov.pl", na=False) | final_str.str.contains(
        "samorzad.gov.pl", na=False
    )
    sam_sub = df[is_samorzad_portal]
    sam_inst = sam_sub[sam_sub["is_institutional_mail"]]

    # Build compact 2,809-record array for instant client-side search & filtering
    records = []
    df_sorted = df.sort_values(["cppc_grant_pln", "teryt7"], ascending=[False, True])
    for _, r in df_sorted.iterrows():
        t7 = clean_str(r["teryt7"])
        pw_info = pw_map.get(t7)
        fm_info = lev_freemail_map.get(t7)

        if clean_bool(r["is_freemail_live"]):
            dmarc_code = "freemail"
        else:
            pol = clean_str(r["dmarc_effective_policy"])
            dmarc_code = pol if pol in ("reject", "quarantine", "none", "missing", "malformed_multiple") else "missing"

        # Tracker code for explorer:
        # "pixel_tr" (5 active Meta Pixel), "meta_sdk" (331+5 zero-click SDK), "consent_ok" (9+4 gated),
        # "ga_zero" (GTM zero-click GA4), "static_gtm" (GTM/GA in HTML), "clean"
        if pw_info:
            if pw_info["activePixel"]:
                trk_code = "pixel_tr"
            elif pw_info["anyMeta"]:
                trk_code = "meta_sdk"
            elif pw_info["cls"] == "CONSENT_GATED_BLOCKED_BEFORE_CLICK":
                trk_code = "consent_ok"
            elif pw_info["gaZeroClick"]:
                trk_code = "ga_zero"
            else:
                trk_code = "clean"
        else:
            if clean_bool(r["meta_pixel"]):
                trk_code = "meta_static"
            elif clean_bool(r["ga_gtm"]):
                trk_code = "static_gtm"
            else:
                trk_code = "clean"

        www_u = clean_str(r["final_url"]) or (
            ("https://" + clean_str(r["www_clean"])) if clean_str(r["www_clean"]) else ""
        )
        on_samorzad = "samorzad.gov.pl" in www_u.lower() or "samorzad.gov.pl" in clean_str(r["www_clean"]).lower()

        mp_raw = clean_str(r["mail_provider_group"])
        if "Microsoft 365" in mp_raw:
            mp_code = "m365"
        elif "Google Workspace" in mp_raw:
            mp_code = "gws"
        elif "NASK" in mp_raw:
            mp_code = "nask"
        elif "home.pl" in mp_raw:
            mp_code = "home"
        elif "nazwa.pl" in mp_raw:
            mp_code = "nazwa"
        elif "OVH" in mp_raw:
            mp_code = "ovh"
        elif "cyberFolks" in mp_raw:
            mp_code = "cfolks"
        elif "Hetzner" in mp_raw:
            mp_code = "hetzner"
        else:
            mp_code = "local"

        spf_st = clean_str(r["spf_status"])
        spf_ap = clean_str(r["spf_all_policy"])
        if spf_st == "missing":
            spf_code = "missing"
        elif "permerror" in spf_st:
            spf_code = "permerror"
        elif "-all" in spf_ap:
            spf_code = "-all"
        elif "~all" in spf_ap:
            spf_code = "~all"
        elif "?all" in spf_ap:
            spf_code = "?all"
        elif "+all" in spf_ap:
            spf_code = "+all"
        else:
            spf_code = "present"

        w_clean = clean_str(r["www_clean"]).lower()
        rec: dict[str, Any] = {
            "t": t7,
            "n": clean_str(r["nazwa_samorządu"]),
            "tp": clean_str(r["typ_JST"]),
            "v": clean_str(r["Województwo"]),
            "p": clean_str(r["Powiat"]),
            "g": round(clean_float(r["cppc_grant_pln"]), 2),
            "cs": 1 if clean_bool(r["has_cs_grant"]) else 0,
            "ed": clean_str(r["email_domain"]).lower(),
            "em": fm_info["liveEmail"] if fm_info else clean_str(r["primary_email"]).lower(),
            "dm": dmarc_code,
            "spf": spf_code,
            "ds": 1 if clean_bool(r["dnssec_valid_ad"]) else 0,
            "mp": mp_code,
            "w": w_clean,
            "wr": 1 if clean_bool(r["web_reachable"]) else 0,
            "tls": 1 if clean_bool(r["https_works_valid_tls"]) else 0,
            "hs": 1 if clean_bool(r["hsts"]) else 0,
            "trk": trk_code,
        }
        if on_samorzad:
            rec["sam"] = 1
        if www_u and www_u.rstrip("/") not in ("https://" + w_clean, "http://" + w_clean):
            rec["wu"] = www_u
        if fm_info and fm_info["ownDomain"]:
            rec["od"] = fm_info["ownDomain"]
            rec["odm"] = fm_info["ownDmarc"]
        if pw_info and pw_info["advMatchPii"]:
            rec["pii"] = 1
        if pw_info and pw_info["clarityHotjar"]:
            rec["hj"] = 1
        if clean_str(r.get("patch_note", "")):
            rec["pn"] = clean_str(r["patch_note"])
        records.append(rec)

    # Double-check headline spotlight cohorts directly on `records` / `df`
    max_grant_no_dmarc_n = int((inst["no_dmarc"] & (inst["cppc_grant_pln"] >= 849000)).sum())
    max_grant_spoof_n = int((inst["spoofable"] & (inst["cppc_grant_pln"] >= 849000)).sum())
    mnp_sub = inst[inst["typ_JST"] == "MNP"]
    mnp_missing_names = sorted(mnp_sub.loc[mnp_sub["no_dmarc"], "nazwa_samorządu"].tolist())
    mnp_pnone_names = sorted(
        mnp_sub.loc[mnp_sub["dmarc_effective_policy"] == "none", "nazwa_samorządu"].tolist()
    )
    voiv_w_sub = inst[inst["typ_JST"] == "W"]
    voiv_w_pnone_names = sorted(
        voiv_w_sub.loc[voiv_w_sub["dmarc_effective_policy"] == "none", "nazwa_samorządu"].tolist()
    )

    cs_spoof_grant_pln = round(float(cs_inst.loc[cs_inst["spoofable"], "cppc_grant_pln"].sum()), 2)
    cs_nodmarc_grant_pln = round(float(cs_inst.loc[cs_inst["no_dmarc"], "cppc_grant_pln"].sum()), 2)
    fm_cs_n = int(df.loc[df["is_freemail_live"], "has_cs_grant"].sum())
    fm_grant_pln = round(float(df.loc[df["is_freemail_live"], "cppc_grant_pln"].sum()), 2)

    payload = {
        "meta": {
            "id": "jst-cyber-2026",
            "issueNumber": 3,
            "generatedAt": "2026-11-04",
            "auditWindow": "2026-11-03/2026-11-04",
            "grantProgramDeadline": "2026-09-30",
            "daysAfterDeadline": 34,
            "totalStatutoryJst": 2809,
            "municipalitiesGminy": int(df["typ_JST"].isin(["MNP", "GM", "GMW", "GW"]).sum()),
            "countiesPowiaty": int((df["typ_JST"] == "P").sum()),
            "voivodeshipsWojewodztwa": int((df["typ_JST"] == "W").sum()),
            "cppcPositiveApplications": 2511,
            "cppcUniqueGrantJst": cs_jst_n,
            "cppcRankingGrantPln": 1483979072.49,
            "cppcSignedContractsN": 2495,
            "cppcSignedContractsGrantPln": 1474312573.61,
            "institutionalMailN": len(inst),
            "liveFreemailN": 30,
        },
        "summary": {
            "dmarcInstitutional": {
                "n": len(inst),
                "missingN": int((inst["dmarc_effective_policy"] == "missing").sum()),
                "malformedMultipleN": int((inst["dmarc_effective_policy"] == "malformed_multiple").sum()),
                "noEffectiveDmarcN": stat_no_dmarc_2779["positiveN"],
                "noEffectiveDmarcPct": stat_no_dmarc_2779["positivePct"],
                "pNoneN": int((inst["dmarc_effective_policy"] == "none").sum()),
                "pNonePct": round(int((inst["dmarc_effective_policy"] == "none").sum()) / len(inst) * 100, 2),
                "spoofableN": stat_spoof_2779["positiveN"],
                "spoofablePct": stat_spoof_2779["positivePct"],
                "quarantineN": int((inst["dmarc_effective_policy"] == "quarantine").sum()),
                "quarantinePct": round(int((inst["dmarc_effective_policy"] == "quarantine").sum()) / len(inst) * 100, 2),
                "rejectN": int((inst["dmarc_effective_policy"] == "reject").sum()),
                "rejectPct": round(int((inst["dmarc_effective_policy"] == "reject").sum()) / len(inst) * 100, 2),
                "strictPct": round(int(inst["strict_dmarc"].sum()) / len(inst) * 100, 2),
                "dnssecValidN": int(inst["dnssec_valid_ad"].map(clean_bool).sum()),
                "dnssecValidPct": round(int(inst["dnssec_valid_ad"].map(clean_bool).sum()) / len(inst) * 100, 2),
                "spfMissingN": int((inst["spf_status"] == "missing").sum()),
                "spfPermerrorOver10N": int((inst["spf_status"] == "permerror_over_10_lookups").sum()),
                "csNoDmarcGrantMln": round(cs_nodmarc_grant_pln / 1e6, 2),
                "csSpoofableGrantMln": round(cs_spoof_grant_pln / 1e6, 2),
                "maxGrantNoDmarcN": max_grant_no_dmarc_n,
                "maxGrantSpoofableN": max_grant_spoof_n,
                "mnpMissingNames": mnp_missing_names,
                "mnpPNoneNames": mnp_pnone_names,
                "voivW_PNoneNames": voiv_w_pnone_names,
                "testNoDmarc": stat_no_dmarc_2779,
                "testSpoofable": stat_spoof_2779,
            },
            "sensitivityVariants": sensitivity_variants,
            "byGrantTier": by_grant_tier,
            "byJstType": by_jst_type,
            "byVoivodeship": by_voivodeship,
            "govPlComparison": {
                "totalRegisteredDomains": len(df_gov_all),
                "activeMxDomains": int(df_gov_all["has_mx"].map(clean_bool).sum()),
                "bySector": gov_sectors,
            },
            "mailSovereignty": {
                "microsoft365N": ms_n,
                "googleWorkspaceN": gg_n,
                "usBigTechTotalN": ms_n + gg_n,
                "usBigTechPct": round((ms_n + gg_n) / len(inst) * 100, 2),
                "govNaskMailN": nask_n,
                "govNaskMailPct": round(nask_n / len(inst) * 100, 2),
                "homePlIonosN": home_n,
                "nazwaPlNetArtN": nazwa_n,
                "ovhCloudN": ovh_n,
                "liveFreemailTotalN": 30,
                "liveFreemailOnlyN": 20,
                "liveFreemailDualN": 10,
                "liveFreemailCsWinnersN": fm_cs_n,
                "liveFreemailGrantMln": round(fm_grant_pln / 1e6, 2),
            },
            "webAndTrackers": {
                "webReachableN": int(df["web_reachable"].map(clean_bool).sum()),
                "brokenTlsN": int(
                    (df["web_reachable"].map(clean_bool) & (~df["https_works_valid_tls"].map(clean_bool))).sum()
                ),
                "brokenTlsPct": round(
                    int((df["web_reachable"].map(clean_bool) & (~df["https_works_valid_tls"].map(clean_bool))).sum())
                    / int(df["web_reachable"].map(clean_bool).sum())
                    * 100,
                    2,
                ),
                "staticMetaFootprintN": 350,
                "playwrightMetaReachableN": len(pw_c1_reach),
                "zeroClickMetaAnyN": len(pw_c1_any),
                "zeroClickMetaAnyPct": round(len(pw_c1_any) / len(pw_c1_reach) * 100, 2),
                "zeroClickMetaSocialSdkN": len(pw_c1_sdk),
                "zeroClickActiveMetaPixelN": len(pw_c1_px),
                "consentGatedProperlyN": len(pw_c1_gated),
                "zeroClickMetaCsWinnersN": int(pw_c1_any["has_cs_grant"].map(clean_bool).sum()),
                "zeroClickMetaGrantMln": round(float(pw_c1_any["cppc_grant_pln"].map(clean_float).sum()) / 1e6, 2),
                "activeMetaPixelGrantMln": round(float(pw_c1_px["cppc_grant_pln"].map(clean_float).sum()) / 1e6, 2),
                "gtmSampleReachableN": len(pw_c2_reach),
                "gtmZeroClickGa4N": len(pw_c2_ga),
                "gtmZeroClickGa4Pct": round(len(pw_c2_ga) / len(pw_c2_reach) * 100, 2),
                "samorzadPortalJstN": len(sam_sub),
                "samorzadPortalMetaTrackersN": int(sam_sub["meta_pixel"].map(clean_bool).sum()),
                "samorzadPortalMailSpoofableN": int(sam_inst["spoofable"].sum()),
                "samorzadPortalMailSpoofablePct": round(int(sam_inst["spoofable"].sum()) / len(sam_inst) * 100, 2),
            },
        },
        "records": records,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT_JSON} ({OUT_JSON.stat().st_size:,} bytes)")
    print("Meta:", json.dumps(payload["meta"], ensure_ascii=False, indent=2))
    print("dmarcInstitutional:", json.dumps(payload["summary"]["dmarcInstitutional"], ensure_ascii=False, indent=2))
    print("sensitivityVariants:", json.dumps(payload["summary"]["sensitivityVariants"], ensure_ascii=False, indent=2))
    print("mailSovereignty:", json.dumps(payload["summary"]["mailSovereignty"], ensure_ascii=False, indent=2))
    print("webAndTrackers:", json.dumps(payload["summary"]["webAndTrackers"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
