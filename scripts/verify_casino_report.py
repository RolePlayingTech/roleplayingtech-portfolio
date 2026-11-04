#!/usr/bin/env python3
"""Deterministic quality, KPI, SEO, defanging & harm-minimization gate for Issue 02:
'Jak państwowe rejestry i strony .gov.pl napędzają ruch nielegalnym kasynom'.

Validates:
  1. `assets/lab/casino-state-2026.json` schema & Phase C reconciled mathematical invariants
  2. Bilingual HTML reports (`pl/lab/panstwo-linkuje-do-kasyna/index.html` &
     `en/lab/state-registries-casinos/index.html`), hub pages, home pages & `sitemap.xml`
  3. Internal `#id` anchors, `data-cas-preset` syntax, canonical/hreflang/OG/Twitter tags & 1200x630 PNGs
  4. 100% strict defanging (`[.]`, zero clickable links to gambling/hijacked/victim hosts)
  5. Zero per-host Vector B1 exploit version strings & zero stale Phase B errors across JSON/HTML/JS/CSS/MD

Uses only the Python 3.12 standard library. Exits 0 on pass, 1 on any error.
"""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import struct
import sys
from typing import Any
import urllib.parse


SITE_ORIGIN = "https://roleplayingtech.com/"
PL_REL = "pl/lab/panstwo-linkuje-do-kasyna/index.html"
EN_REL = "en/lab/state-registries-casinos/index.html"

HTML_FILES = (
    PL_REL,
    EN_REL,
    "pl/lab/index.html",
    "en/lab/index.html",
    "pl/index.html",
    "en/index.html",
)

ISSUE2_TEXT_FILES = (
    "assets/lab/casino-state-2026.json",
    PL_REL,
    EN_REL,
    "assets/lab/casino-explorer.js",
    "assets/lab/casino-explorer.css",
    "docs/lab/casino-state-methodology.md",
    "docs/lab/casino-state-press-kit.md",
)

ALLOWED_PRESET_KEYS = {"view", "q", "cohort", "vec", "voiv", "public", "live", "rspo", "mc", "sub"}
ALLOWED_VIEWS = {"unblocked", "victims", "banned", "govlinks"}
ALLOWED_COHORTS = {
    "ACTIVE_RSPO_2025_2026",
    "ABANDONED_RSPO_2018_2023",
    "ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026",
    "ACTIVE_REJESTR_ZLOBKOW_2026",
    "PUBLIC_OR_REGISTRY_INSTITUTION",
    "WIKIPEDIA_CITED_PL_DOMAIN",
}
ALLOWED_VECTORS = {
    "VECTOR_A_FULL_CASINO_TAKEOVER",
    "VECTOR_B2_DROPCAUGHT_SEO_FACADE",
    "VECTOR_B1_LIVE_CMS_COMPROMISE",
    "WAYBACK_CLONED_SCHOOL_PBN",
    "CASINO_BLOG_OR_CRASH_GAME_FACADE",
}

ALLOWED_EXTERNAL_HOST_SUFFIXES = (
    ".gov.pl",
    "gov.pl",
    ".bip.warszawa.pl",
    "bip.ceglow.pl",
    "przedszkole2.bip.klodzko.pl",
    "powiat.klodzko.pl",
    "zsczernin.bip.gmina.sztum.pl",
    "bip.ug.puck.pl",
    "wikipedia.org",
    "wikimedia.org",
    "roleplayingtech.com",
    "mumro.io",
    "swiadek-dziejow.pl",
    "crewly.pl",
    "github.com",
    "x.com",
    "linkedin.com",
    "instagram.com",
    "youtube.com",
    "tiktok.com",
    "facebook.com",
    "substack.com",
    "developers.google.com",
    "poland.learningpassport.org",
    "niebezpiecznik.pl",
    "cert.pl",
    "nik.gov.pl",
    "openprovider.com",
    "dns.pl",
)

FORBIDDEN_PER_HOST_EXPLOIT_PATTERNS = (
    re.compile(r"PHP/5\.6\.40", re.I),
    re.compile(r"\brevslider\b", re.I),
    re.compile(r"\bjs_composer\b", re.I),
    re.compile(r"WordPress\s+4\.6\.10", re.I),
    re.compile(r"WordPress\s+5\.1\.19", re.I),
    re.compile(r"/anulowanie-auto-wykluczenia-z-kasyna", re.I),
    re.compile(r"\['vcard'", re.I),
)

FORBIDDEN_STALE_PHASE_B_PATTERNS = (
    (re.compile(r"Kr[óo]lowej\s+Jadwigi\s+w\s+Woli\s+Rasztowskiej", re.I), "błędny patron szkoły w Woli Rasztowskiej"),
    (re.compile(r"000000013626"), "błędny numer księgi RPWDL dla PZZOZ Będzin (poprawny: 000000014475)"),
    (re.compile(r"\bpzdw(?:\[\.\]|\.)pl\b", re.I), "odrzucony fałszywy rekord z Fazy A (pzdw.pl)"),
    (re.compile(r"\bpzkosz(?:\[\.\]|\.)pl\b", re.I), "odrzucony fałszywy rekord z Fazy A (pzkosz.pl)"),
    (re.compile(r"\bspstrzelce(?:\[\.\]|\.)pl\b", re.I), "nieistniejąca domena z podsumowania (spstrzelce)"),
    (re.compile(r"[A-Za-z0-9]\.(?:bet|casino)\b", re.I), "niezneutralizowana domena marki hazardowej (.bet / .casino bez [.])"),
    (re.compile(r"Szko[łl][ayę]\s+z\s+Klas[ąa]|School\s+with\s+Class", re.I), "błędna nazwa fundacji przy Learning Passport (poprawna: Fundacja SOK)"),
    (re.compile(r"\$10\^"), "surowy zapis LaTeX $10^...$ w pliku repozytorium zamiast 10<sup>...</sup>"),
    (re.compile(r"śląskiego\s*\(41\)|Śląskie\s*\(41\)"), "nieaktualna liczba województwa śląskiego (41 zamiast zweryfikowanych danych)"),
)

VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class MiniDomParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.elements: list[tuple[str, dict[str, str], int]] = []
        self.ids: list[tuple[str, int]] = []
        self.text_chunks: list[str] = []
        self._in_script_or_style = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        t = tag.lower()
        ad = {k.lower(): (v if v is not None else "") for k, v in attrs}
        line = self.getpos()[0]
        self.elements.append((t, ad, line))
        if "id" in ad and ad["id"].strip():
            self.ids.append((ad["id"].strip(), line))
        if t in ("script", "style"):
            self._in_script_or_style += 1

    def handle_endtag(self, tag: str) -> None:
        t = tag.lower()
        if t in ("script", "style") and self._in_script_or_style > 0:
            self._in_script_or_style -= 1

    def handle_data(self, data: str) -> None:
        if self._in_script_or_style == 0:
            self.text_chunks.append(data)


def png_dimensions(path: Path) -> tuple[int, int] | None:
    if not path.is_file():
        return None
    raw = path.read_bytes()
    if len(raw) < 24 or raw[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    w, h = struct.unpack(">II", raw[16:24])
    return int(w), int(h)


def expect(actual: Any, expected: Any, label: str, errors: list[str]) -> None:
    if actual != expected:
        errors.append(f"[INWARIANT] {label}: jest {actual!r}, oczekiwano {expected!r}.")


def validate_json_dataset(payload: dict[str, Any], errors: list[str]) -> tuple[set[str], set[str]]:
    summ = payload.get("summary", {})
    funnel = summ.get("scanFunnel", {})
    vecs = summ.get("vectors", {})
    silos = summ.get("liveSilos", {})
    mf = summ.get("mfRegister", {})
    infra = summ.get("infrastructure", {})
    surv = summ.get("survival", {})

    unblocked = payload.get("unblocked", [])
    mf_banned = payload.get("mfBanned", [])
    gov_links = payload.get("govBipLinks", [])
    voivs = summ.get("voivodeships", [])

    expect(len(unblocked), 291, "liczba rekordów unblocked", errors)
    expect(len(mf_banned), 68, "liczba rekordów mfBanned", errors)
    expect(len(gov_links), 9, "liczba unikalnych stron govBipLinks", errors)
    expect(sum(int(g.get("domAnchorOccurrences", 0)) for g in gov_links), 10, "suma żywych kotwic <a href> w govBipLinks", errors)

    # Funnel & cohort partitions
    expect(funnel.get("cohortScansTotal"), 35730, "cohortScansTotal", errors)
    expect(funnel.get("crossCohortOverlaps"), 147, "crossCohortOverlaps", errors)
    expect(funnel.get("uniqueRegistrableRoots"), 35583, "uniqueRegistrableRoots", errors)
    expect(funnel.get("unblockedTotal"), 291, "unblockedTotal", errors)
    expect(funnel.get("endToEndUnblockedTotal"), 287, "endToEndUnblockedTotal", errors)
    expect(funnel.get("redirectsToMfBannedHubCount"), 4, "redirectsToMfBannedHubCount", errors)
    expect(sum(1 for r in unblocked if r.get("redirectsToMfBannedHub")), 4, "rekordy redirectsToMfBannedHub", errors)
    expect(sum(1 for r in unblocked if r.get("isPublicSector")), 166, "rekordy sektora publicznego w unblocked", errors)

    cohort_counts = Counter(r.get("registryCohort") for r in unblocked)
    expect(cohort_counts["ACTIVE_RSPO_2025_2026"], 105, "kohorta ACTIVE_RSPO_2025_2026", errors)
    expect(cohort_counts["ABANDONED_RSPO_2018_2023"], 139, "kohorta ABANDONED_RSPO_2018_2023", errors)
    expect(cohort_counts["ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026"], 41, "kohorta ACTIVE_RPWDL", errors)
    expect(cohort_counts["ACTIVE_REJESTR_ZLOBKOW_2026"], 6, "kohorta rezydualna ACTIVE_REJESTR_ZLOBKOW", errors)

    # Vector partitions
    vec_counts = Counter(r.get("vectorTier") for r in unblocked)
    expect(vec_counts["VECTOR_A_FULL_CASINO_TAKEOVER"], 242, "Wektor A count", errors)
    expect(vec_counts["VECTOR_B2_DROPCAUGHT_SEO_FACADE"], 27, "Wektor B2 count", errors)
    expect(vec_counts["VECTOR_B1_LIVE_CMS_COMPROMISE"], 22, "Wektor B1 count", errors)
    expect(vecs.get("vectorB1", {}).get("activePublicInstitutionsCount"), 8, "Wektor B1 aktywne instytucje publiczne", errors)
    expect(vecs.get("vectorB1", {}).get("publicSectorServersTotal"), 9, "Wektor B1 serwery publiczne ogółem", errors)

    sub_counts = Counter(
        r.get("facadeSubtype")
        for r in unblocked
        if r.get("vectorTier") == "VECTOR_B2_DROPCAUGHT_SEO_FACADE"
    )
    expect(sub_counts["WAYBACK_CLONED_SCHOOL_PBN"], 15, "Wektor B2 WAYBACK_CLONED_SCHOOL_PBN", errors)
    expect(sub_counts["CASINO_BLOG_OR_CRASH_GAME_FACADE"], 12, "Wektor B2 CASINO_BLOG_OR_CRASH_GAME_FACADE", errors)

    # Silos & Post-ban checks
    expect(sum(1 for r in unblocked if r.get("stillLivePrimaryCohort")), 156, "stillLivePrimaryCohort", errors)
    expect(sum(1 for r in unblocked if r.get("stillLiveAnyPrimaryRegistry")), 158, "stillLiveAnyPrimaryRegistry", errors)
    expect(sum(1 for r in unblocked if r.get("inMcRes65294")), 137, "unblocked w MC res. 65294", errors)
    expect(sum(1 for r in mf_banned if r.get("inMcRes65294")), 22, "mfBanned w MC res. 65294", errors)
    expect(sum(1 for r in mf_banned if r.get("stillLiveRspo")), 9, "mfBanned żywe domeny w rspo.gov.pl", errors)
    expect(sum(int(r.get("liveRspoCardsCount", 0)) for r in mf_banned if r.get("stillLiveRspo")), 16, "mfBanned żywe karty w rspo.gov.pl", errors)
    expect(sum(1 for r in mf_banned if r.get("stillLiveActiveRspoCard")), 3, "mfBanned aktywne karty RSPO", errors)

    # Specific Phase C forensic spot-checks in JSON
    bedzin = next((r for r in mf_banned if r.get("defangedDomain") == "pzzoz[.]bedzin[.]pl"), None)
    if not bedzin:
        errors.append("[JSON] Brak rekordu pzzoz[.]bedzin[.]pl w mfBanned.")
    else:
        expect(bedzin.get("wikipediaArticlesCount"), 0, "pzzoz[.]bedzin[.]pl wikipediaArticlesCount", errors)
        if "000000014475" not in str(bedzin.get("rpwdlNotePl", "")) and "000000014475" not in str(bedzin.get("officialVerificationUrl", "")):
            errors.append("[JSON] pzzoz[.]bedzin[.]pl nie wskazuje księgi 000000014475.")

    wola = next((r for r in mf_banned if r.get("defangedDomain") == "spwolarasztowska[.]pl"), None)
    if not wola:
        errors.append("[JSON] Brak rekordu spwolarasztowska[.]pl w mfBanned.")
    else:
        expect(wola.get("mfEnforcementLagDays"), 38, "spwolarasztowska[.]pl mfEnforcementLagDays", errors)

    # MF 10-year series, Infrastructure & Kaplan-Meier
    expect(mf.get("xmlTotalEntries"), 59376, "MF xmlTotalEntries", errors)
    expect(mf.get("plShare2023FullPslPct"), 0.82, "MF 2023 PSL %", errors)
    expect(mf.get("plShare2025FullPslPct"), 5.6, "MF 2025 PSL %", errors)
    expect(mf.get("plShare2026FullPslPct"), 21.51, "MF 2026 PSL %", errors)
    expect(mf.get("plSurgeFullPslMultiple"), 26.2, "MF surge multiple", errors)

    expect(infra.get("cloudflareSyndicateCount"), 710, "Cloudflare syndicate count", errors)
    expect(infra.get("cloudflareSyndicateAllDenom"), 859, "Cloudflare all denom", errors)
    expect(infra.get("cloudflareActiveResolvingDenom"), 738, "Cloudflare active denom", errors)
    expect(infra.get("rdapResolvedTotal"), 105, "RDAP resolved total", errors)

    expect(surv.get("kaplanMeierTotalN"), 101, "Kaplan-Meier N", errors)
    km_cp = surv.get("kaplanMeierCheckpoints", {})
    expect(km_cp.get("d90"), 94.47, "Kaplan-Meier S(90d)", errors)
    expect(km_cp.get("d180"), 77.31, "Kaplan-Meier S(180d)", errors)
    expect(km_cp.get("d365"), 62.95, "Kaplan-Meier S(365d)", errors)

    expect(len(voivs), 16, "liczba województw", errors)
    expect(sum(int(v.get("total", 0)) for v in voivs), 291, "suma województw == 291", errors)
    known_voivs = {str(v.get("voivodeship")) for v in voivs}

    # Reconstruct raw domain set in memory strictly to scan files for accidental undefanged leaks
    sensitive_raw_domains: set[str] = set()
    for r in unblocked:
        dd = str(r.get("defangedDomain", ""))
        if "[.]" not in dd:
            errors.append(f"[DEFANG JSON] Niezneutralizowana domena w unblocked: {dd!r}")
        else:
            sensitive_raw_domains.add(dd.replace("[.]", ".").lower())
        dh = str(r.get("defangedRedirectHub", ""))
        if dh:
            if "[.]" not in dh:
                errors.append(f"[DEFANG JSON] Niezneutralizowany hub w unblocked: {dh!r}")
            else:
                sensitive_raw_domains.add(dh.replace("[.]", ".").lower())
        # Ensure Vector B1 records expose zero plugin/PHP versions
        if r.get("vectorTier") == "VECTOR_B1_LIVE_CMS_COMPROMISE":
            for k, val in r.items():
                if k in ("serverHeader", "cmsVersion", "vulnerablePlugins", "injectedPaths"):
                    errors.append(f"[B1 REDACTION] Niedozwolone pole {k!r} w rekordzie Wektora B1 {dd}")

    for r in mf_banned:
        dd = str(r.get("defangedDomain", ""))
        if "[.]" not in dd:
            errors.append(f"[DEFANG JSON] Niezneutralizowana domena w mfBanned: {dd!r}")
        else:
            sensitive_raw_domains.add(dd.replace("[.]", ".").lower())

    for g in gov_links:
        dt = str(g.get("defangedTargetDomain", ""))
        if "[.]" not in dt:
            errors.append(f"[DEFANG JSON] Niezneutralizowany cel w govBipLinks: {dt!r}")
        else:
            sensitive_raw_domains.add(dt.replace("[.]", ".").lower())

    # Additional domains mentioned in prose/clusters
    for extra in ("learningpassport.pl", "puchalskidietetyk.pl", "budowajablonki.pl", "personelgroup.pl", "kanapkibankietowe.pl", "kardiometr.pl"):
        sensitive_raw_domains.add(extra)

    return sensitive_raw_domains, known_voivs


def is_allowed_external_href(href: str, sensitive_raw_domains: set[str]) -> tuple[bool, str]:
    parsed = urllib.parse.urlparse(href)
    host = (parsed.hostname or "").lower().rstrip(".")
    if not host:
        return False, "brak hosta w URL"
    if host in sensitive_raw_domains:
        return False, f"link wskazuje bezpośrednio na przejętą/zainfekowaną domenę {host!r}"
    for d in sensitive_raw_domains:
        if host.endswith("." + d):
            return False, f"link wskazuje na subdomenę przejętej/zainfekowanej domeny {host!r}"
    if any(host == suf.lstrip(".") or host.endswith(suf if suf.startswith(".") else "." + suf) for suf in ALLOWED_EXTERNAL_HOST_SUFFIXES):
        return True, ""
    return False, f"nieznany zewnętrzny host {host!r} poza białą listą źródeł urzędowych"


def validate_html_and_seo(
    repo_root: Path,
    known_voivs: set[str],
    sensitive_raw_domains: set[str],
    errors: list[str],
) -> None:
    parsed_docs: dict[str, tuple[MiniDomParser, str]] = {}
    for rel in HTML_FILES:
        fpath = repo_root / Path(rel)
        if not fpath.is_file():
            errors.append(f"[HTML] Brak pliku `{rel}`.")
            continue
        raw = fpath.read_text(encoding="utf-8")
        p = MiniDomParser()
        p.feed(raw)
        parsed_docs[rel] = (p, raw)

        # Unique IDs & internal anchor validation
        id_counts = Counter(i for i, _ in p.ids)
        for dup_id, cnt in id_counts.items():
            if cnt > 1:
                errors.append(f"[HTML ID] {rel}: zduplikowane id={dup_id!r} ({cnt}x).")
        known_ids = set(id_counts.keys())

        for tag, attrs, line in p.elements:
            if "href" in attrs:
                href = attrs["href"].strip()
                if href == "#":
                    errors.append(f"[HTML HREF] {rel}:{line}: pusta kotwica href='#'.")
                elif href.startswith("#"):
                    frag = urllib.parse.unquote(href[1:])
                    if frag not in known_ids:
                        errors.append(f"[HTML HREF] {rel}:{line}: kotwica {href!r} nie istnieje w dokumencie.")
                elif href.startswith(("http://", "https://")):
                    ok, reason = is_allowed_external_href(href, sensitive_raw_domains)
                    if not ok:
                        errors.append(f"[HTML ZEW. LINK] {rel}:{line}: niedozwolony href={href!r} ({reason}).")

            if "data-cas-preset" in attrs:
                preset = attrs["data-cas-preset"].strip()
                pairs = urllib.parse.parse_qsl(preset, keep_blank_values=True)
                if not pairs:
                    errors.append(f"[PRESET] {rel}:{line}: pusty data-cas-preset.")
                for k, v in pairs:
                    if k not in ALLOWED_PRESET_KEYS:
                        errors.append(f"[PRESET] {rel}:{line}: nieznany klucz {k!r} w data-cas-preset={preset!r}.")
                    elif k == "view" and v not in ALLOWED_VIEWS:
                        errors.append(f"[PRESET] {rel}:{line}: nieznany view={v!r}.")
                    elif k == "cohort" and v not in ALLOWED_COHORTS:
                        errors.append(f"[PRESET] {rel}:{line}: nieznana kohorta cohort={v!r}.")
                    elif k == "vec" and v not in ALLOWED_VECTORS:
                        errors.append(f"[PRESET] {rel}:{line}: nieznany wektor vec={v!r}.")
                    elif k == "voiv" and v not in known_voivs:
                        errors.append(f"[PRESET] {rel}:{line}: nieznane województwo voiv={v!r}.")
                    elif k in ("public", "live", "rspo", "mc") and v not in ("0", "1"):
                        errors.append(f"[PRESET] {rel}:{line}: flaga {k}={v!r} musi wynosić 0 lub 1.")

    # Report-specific SEO, OG & prose KPI checks
    expected_canon = {
        PL_REL: "https://roleplayingtech.com/pl/lab/panstwo-linkuje-do-kasyna/",
        EN_REL: "https://roleplayingtech.com/en/lab/state-registries-casinos/",
    }
    expected_og_img = {
        PL_REL: "assets/lab/og-casino-state-2026-pl.png",
        EN_REL: "assets/lab/og-casino-state-2026-en.png",
    }

    for rel, lang in ((PL_REL, "pl"), (EN_REL, "en")):
        if rel not in parsed_docs:
            continue
        p, _ = parsed_docs[rel]
        vis_txt = re.sub(r"\s+", " ", "".join(p.text_chunks))

        # Canonical + hreflang + OG image
        canons = [a.get("href", "") for t, a, _ in p.elements if t == "link" and "canonical" in a.get("rel", "").split()]
        expect(canons, [expected_canon[rel]], f"{rel} canonical", errors)

        alts = {
            a.get("hreflang", ""): a.get("href", "")
            for t, a, _ in p.elements
            if t == "link" and "alternate" in a.get("rel", "").split() and a.get("hreflang")
        }
        expect(alts.get("pl"), expected_canon[PL_REL], f"{rel} hreflang=pl", errors)
        expect(alts.get("en"), expected_canon[EN_REL], f"{rel} hreflang=en", errors)

        og_imgs = [
            a.get("content", "")
            for t, a, _ in p.elements
            if t == "meta" and a.get("property") == "og:image"
        ]
        exp_img_url = SITE_ORIGIN + expected_og_img[rel]
        expect(og_imgs, [exp_img_url], f"{rel} og:image", errors)
        dims = png_dimensions(repo_root / expected_og_img[rel])
        expect(dims, (1200, 630), f"{expected_og_img[rel]} wymiary PNG", errors)

        noscripts = sum(1 for t, _, _ in p.elements if t == "noscript")
        if noscripts < 1:
            errors.append(f"[HTML] {rel}: brak elementu <noscript>.")

        # Key reconciled numbers present in visible report text
        req_tokens = (
            ("35 583" if lang == "pl" else "35,583"),
            ("59 376" if lang == "pl" else "59,376"),
            "291",
            "287",
            "158",
            "242",
            "27",
            "22",
            ("26,2" if lang == "pl" else "26.2"),
            ("0,82%" if lang == "pl" else "0.82%"),
            ("21,51%" if lang == "pl" else "21.51%"),
            ("94,5%" if lang == "pl" else "94.5%"),
            ("82,7%" if lang == "pl" else "82.7%"),
            ("96,2%" if lang == "pl" else "96.2%"),
            "657",
            "527",
            "000000014475",
        )
        for tok in req_tokens:
            if tok not in vis_txt:
                errors.append(f"[KPI PROZA] {rel}: brak wymaganej zweryfikowanej wartości {tok!r} w tekście raportu.")

    # Sitemap check
    sm_path = repo_root / "sitemap.xml"
    if not sm_path.is_file():
        errors.append("[SITEMAP] Brak pliku sitemap.xml.")
    else:
        sm_raw = sm_path.read_text(encoding="utf-8")
        for url in expected_canon.values():
            if f"<loc>{url}</loc>" not in sm_raw:
                errors.append(f"[SITEMAP] Brak wpisu <loc>{url}</loc> w sitemap.xml.")


def scan_defanging_and_harm_minimization(
    repo_root: Path,
    sensitive_raw_domains: set[str],
    errors: list[str],
) -> None:
    # Build single compiled alternation regex for all 360+ sensitive raw domains
    # Exclude matches that are actually official BIP subdomains such as `przedszkole337.bip.warszawa.pl`
    # (in `przedszkole337.bip.warszawa.pl`, `przedszkole337.pl` does NOT occur contiguously, so exact domain match is super clean!)
    escaped = sorted((re.escape(d) for d in sensitive_raw_domains if "." in d), key=len, reverse=True)
    raw_dom_re = re.compile(r"(?<![a-z0-9-])(?:" + "|".join(escaped) + r")(?![a-z0-9-])", re.I)

    for rel in ISSUE2_TEXT_FILES:
        fpath = repo_root / Path(rel)
        if not fpath.is_file():
            errors.append(f"[PLIK] Brak wymaganego pliku Issue 02: `{rel}`.")
            continue
        txt = fpath.read_text(encoding="utf-8")

        for m in raw_dom_re.finditer(txt):
            line_no = txt.count("\n", 0, m.start()) + 1
            errors.append(
                f"[WYCIEK DOMENY BEZ [.]!] {rel}:{line_no}: znaleziono niezneutralizowaną domenę {m.group(0)!r}."
            )

        for pat in FORBIDDEN_PER_HOST_EXPLOIT_PATTERNS:
            m = pat.search(txt)
            if m:
                line_no = txt.count("\n", 0, m.start()) + 1
                errors.append(
                    f"[HARM-MINIMIZATION B1] {rel}:{line_no}: znaleziono zabroniony ślad podatności/vCard {m.group(0)!r}."
                )

        for pat, desc in FORBIDDEN_STALE_PHASE_B_PATTERNS:
            m = pat.search(txt)
            if m:
                line_no = txt.count("\n", 0, m.start()) + 1
                errors.append(
                    f"[STARY BŁĄD FAZY B] {rel}:{line_no}: znaleziono wyeliminowany błąd ({desc}): {m.group(0)!r}."
                )


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    repo_root = Path(__file__).resolve().parent.parent
    json_path = repo_root / "assets" / "lab" / "casino-state-2026.json"
    errors: list[str] = []

    if not json_path.is_file():
        print(f"BŁĄD: Brak pliku {json_path}", file=sys.stderr)
        return 1

    payload = json.loads(json_path.read_text(encoding="utf-8"))
    sensitive_raw_domains, known_voivs = validate_json_dataset(payload, errors)
    validate_html_and_seo(repo_root, known_voivs, sensitive_raw_domains, errors)
    scan_defanging_and_harm_minimization(repo_root, sensitive_raw_domains, errors)

    if errors:
        print(f"ŚLUZA JAKOŚCI ISSUE 02 (REJESTRY & HAZARD) — NIEPOWODZENIE ({len(errors)} błędów):")
        for idx, err in enumerate(errors, start=1):
            print(f"  {idx:>3d}. {err}")
        return 1

    print(
        f"ŚLUZA JAKOŚCI ISSUE 02 — OK (0 błędów) · "
        f"35 583 zbadane domeny · 291 aktywnych poza blokadą (287 end-to-end) · "
        f"68 zablokowanych w bazach · 9 stron .gov.pl/BIP (10 linków) · "
        f"zweryfikowano {len(sensitive_raw_domains)} wrażliwych domen (100% [.] defanged) "
        f"w {len(ISSUE2_TEXT_FILES)} plikach oraz 2 karty OG 1200x630."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
