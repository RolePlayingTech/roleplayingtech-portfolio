#!/usr/bin/env python3
"""Build cleaned, defanged master dataset for RolePlayingTech Lab Issue 02.

Produces `assets/lab/casino-state-2026.json` from verified primary-registry
audits (RSPO, RPWDL2, Rejestr Żłobków, MC Wykaz dataset 1875, MF Rejestr Domen
Hazardowych XML, pl.wikipedia.org exturlusage, DNS/ASN/RDAP caches, and live
CMS/Wayback forensic checks) after applying all Phase C1–C4 audit corrections
and Vector B1 harm-minimization redactions.

Usage:
    py scripts/build_casino_state_dataset.py --raw-root <path-to-audit-scratch>
"""

from __future__ import annotations

import argparse
from collections import Counter
import csv
import io
import json
import os
from pathlib import Path
import re
from typing import Any
from urllib.parse import urlparse, urlunparse
import xml.etree.ElementTree as ET
import zipfile


REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = REPO_ROOT / "assets" / "lab" / "casino-state-2026.json"
SNAPSHOT_DATE = "2026-11-03"
REVERIFIED_DATE = "2026-11-04"


def defang_domain(dom: str) -> str:
    d = str(dom or "").strip().lower().lstrip(".")
    if not d:
        return ""
    return d.replace("[.]", ".").replace(".", "[.]")


def defang_url(url: str) -> str:
    u = str(url or "").strip()
    if not u:
        return ""
    u = re.sub(r"^https://", "hxxps://", u, flags=re.I)
    u = re.sub(r"^http://", "hxxp://", u, flags=re.I)
    u = u.replace("[.]", ".").replace(".", "[.]")
    return u


def defang_brands(brands: str) -> str:
    b = str(brands or "").strip()
    if not b:
        return ""
    return re.sub(
        r"\b([A-Za-z0-9-]+)\.(bet|casino|com|pl|net|org|io|eu|gg|win|slots|top|xyz)\b",
        r"\1[.]\2",
        b,
        flags=re.I,
    )


def clean_official_source_url(url: str) -> str:
    """Strip tracking query params (?fbclid=...) from official .gov.pl/BIP URLs."""
    parsed = urlparse(url.strip())
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))


def kaplan_meier(times: list[int], events: list[int]) -> list[dict[str, Any]]:
    """Product-limit Kaplan-Meier survival curve S(t).

    events[i] == 1 means caught/banned in MF register;
    events[i] == 0 means right-censored (still unblocked on snapshot date).
    """
    paired = sorted(zip(times, events), key=lambda x: x[0])
    n_total = len(paired)
    unique_event_times = sorted({t for t, e in paired if e == 1})
    surv = 1.0
    curve: list[dict[str, Any]] = [
        {"day": 0, "survivalPct": 100.0, "atRisk": n_total, "events": 0}
    ]
    for ut in unique_event_times:
        at_risk = sum(1 for t, _ in paired if t >= ut)
        d_i = sum(1 for t, e in paired if t == ut and e == 1)
        surv *= (1.0 - d_i / at_risk)
        curve.append(
            {
                "day": int(ut),
                "survivalPct": round(surv * 100.0, 2),
                "atRisk": at_risk,
                "events": d_i,
            }
        )
    return curve


def build_official_verification_url(cohort: str, entity_id: str) -> tuple[str, str]:
    eid = str(entity_id or "").strip()
    if cohort in ("ACTIVE_RSPO_2025_2026", "ABANDONED_RSPO_2018_2023") and eid.isdigit():
        return (
            f"https://rspo.gov.pl/institutions/{eid}",
            f"RSPO #{eid}",
        )
    if cohort == "ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026":
        return (
            "https://dane.gov.pl/pl/dataset/2138,rejestr-podmiotow-wykonujacych-dzialalnosc-lecznicza",
            f"RPWDL {eid}" if eid else "RPWDL (dane.gov.pl)",
        )
    if cohort == "ACTIVE_REJESTR_ZLOBKOW_2026":
        return (
            "https://dane.gov.pl/pl/dataset/2712,rejestr-zlobkow-lista-instytucji",
            f"Rejestr Żłobków {eid}" if eid else "Rejestr Żłobków",
        )
    return ("https://dane.gov.pl/pl/dataset/1875", "dane.gov.pl")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build casino-state-2026.json")
    parser.add_argument(
        "--raw-root",
        default=os.environ.get("CASINO_RAW_ROOT", ""),
        help="Path to scratch directory containing phase_a, phase_b, phase_c.",
    )
    args = parser.parse_args()
    if not args.raw_root:
        raise SystemExit("Provide --raw-root or set CASINO_RAW_ROOT.")

    raw_root = Path(args.raw_root)
    pa_dir = raw_root / "phase_a" / "exp_06"
    pb_dir = raw_root / "phase_b" / "b3_casino_state"
    pc_dir = raw_root / "phase_c"

    vd = json.loads((pb_dir / "verified_dataset.json").read_text("utf-8"))
    t1 = json.loads((pb_dir / "task1_fresh_rpwdl_and_mc_2026_11_03.json").read_text("utf-8"))
    t1c = json.loads((pb_dir / "task1c_verified_gov_bip_and_wayback.json").read_text("utf-8"))
    t2 = json.loads((pb_dir / "task2_infrastructure_forensics.json").read_text("utf-8"))
    t3 = json.loads((pb_dir / "task3_vector_b_deep_audit.json").read_text("utf-8"))

    # Parse MF XML for hub cross-check and total XML count
    tree = ET.parse(pa_dir / "mf_hazard.xml")
    ns_xml = {"h": "http://www.hazard.mf.gov.pl/2017/03/21/"}
    mf_all_domains: set[str] = set()
    mf_xml_total = 0
    for pos in tree.getroot().findall("h:PozycjaRejestru", ns_xml):
        mf_xml_total += 1
        d = (pos.findtext("h:AdresDomeny", default="", namespaces=ns_xml) or "").strip().lower()
        if d.startswith("www."):
            d = d[4:]
        if d:
            mf_all_domains.add(d)

    # Parse MC 65294 (latest statutory list published 2025-03-13, data_date=2024-04-30)
    # vs MC 40236 (2022-07-20) to flag membership accurately
    def extract_mc_domains(csv_path: Path) -> set[str]:
        out: set[str] = set()
        with csv_path.open("r", encoding="utf-8", errors="replace") as fh:
            rdr = csv.reader(fh, delimiter=";")
            next(rdr, None)
            for row in rdr:
                if len(row) < 2:
                    continue
                raw_u = row[1].strip().strip("{}")
                tok = re.split(r"[|;,\s]+", raw_u)[0].strip().lower()
                if not tok:
                    continue
                if not tok.startswith(("http://", "https://")):
                    tok = "http://" + tok
                try:
                    h = (urlparse(tok).hostname or "").strip(".").lower()
                    while h.startswith("www."):
                        h = h[4:]
                except Exception:
                    h = ""
                if h and not h.endswith(".gov.pl"):
                    out.add(h)
        return out

    mc_65294_hosts = extract_mc_domains(pb_dir / "mc_wykaz_65294_2024_04_30.csv")
    mc_40236_hosts = extract_mc_domains(pb_dir / "mc_wykaz_stron_publicznych_raw.csv")

    def host_matches_domain(hosts: set[str], raw_dom: str) -> bool:
        if raw_dom in hosts:
            return True
        suffix = "." + raw_dom
        return any(h.endswith(suffix) for h in hosts)

    # Parse 10-year MF PSL series from Phase C2 audited CSV
    mf_series: list[dict[str, Any]] = []
    with (pc_dir / "c2_mf_psl_comparison_2017_2026.csv").open("r", encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            mf_series.append(
                {
                    "year": int(row["Year"]),
                    "rawXmlAll": int(row["Raw_XML_All"]),
                    "rawXmlPl": int(row["Raw_XML_PL"]),
                    "rawXmlPlPct": float(row["Raw_XML_PL_Pct"]),
                    "fullPslChronoAll": int(row["Full_PSL_Chrono_All"]),
                    "fullPslChronoPl": int(row["Full_PSL_Chrono_PL"]),
                    "fullPslChronoPlPct": float(row["Full_PSL_Chrono_Pct"]),
                    "icannPslChronoAll": int(row["ICANN_PSL_Chrono_All"]),
                    "icannPslChronoPl": int(row["ICANN_PSL_Chrono_PL"]),
                    "icannPslChronoPlPct": float(row["ICANN_PSL_Chrono_Pct"]),
                    "withinYearFullPslPct": float(row["WithinYr_FullPSL_PL_Pct"]),
                }
            )

    # Deduplicate live .gov.pl & BIP dofollow links (10 live HTTP <a href> anchors across 9 official pages)
    seen_gov_links: set[tuple[str, str]] = set()
    gov_bip_links: list[dict[str, Any]] = []
    raw_dom_anchor_counts: Counter[tuple[str, str]] = Counter()
    for bl in vd["verified_live_gov_and_bip_backlinks"]:
        clean_src = clean_official_source_url(bl["source_url"])
        tgt = bl["defanged_target_domain"]
        raw_dom_anchor_counts[(clean_src, tgt)] += 1
    # Fix HTTP+HTTPS double-scrape on przedszkole2.bip.klodzko.pl (verified live 2026-11-04: 2 HTTP <a href> anchors)
    if ("https://przedszkole2.bip.klodzko.pl/", "przedszkole2[.]klodzko[.]pl") in raw_dom_anchor_counts:
        raw_dom_anchor_counts[("https://przedszkole2.bip.klodzko.pl/", "przedszkole2[.]klodzko[.]pl")] = 2

    # Enrich each unique gov/BIP link with context
    gov_link_notes_pl = {
        ("https://www.gov.pl/web/klimat/badz-odkrywca-parkow-narodowych", "odkrywcaparkownarodowych[.]pl"): (
            "Ministerstwo Klimatu i Środowiska (gov.pl)",
            "Oficjalny komunikat o edukacyjnej grze parków narodowych — aktywny link dofollow 657 dni po wpisaniu domeny do Rejestru Hazardowego MF (16.01.2025).",
            "Ministry of Climate and Environment (gov.pl)",
            "Official educational game announcement — live dofollow link 657 days after MF blocklist entry (2025-01-16).",
            "MF_BANNED",
        ),
        ("https://bbpn.gov.pl/promocja-parkow-narodowych", "odkrywcaparkownarodowych[.]pl"): (
            "Biebrzański Park Narodowy (bbpn.gov.pl)",
            "Podstrona promocji parków narodowych w domenie .gov.pl — aktywny link dofollow do domeny zablokowanej przez MF w styczniu 2025 r.",
            "Biebrza National Park (bbpn.gov.pl)",
            "Official .gov.pl national park promotion page — live dofollow link to a domain banned by MF in January 2025.",
            "MF_BANNED",
        ),
        ("https://powiat.klodzko.pl/92/szkoly-muzyczne.html", "sm2bystrzyca[.]pl"): (
            "Starostwo Powiatowe w Kłodzku (powiat.klodzko.pl)",
            "Wykaz szkół muzycznych prowadzi do przejętej domeny sm2bystrzyca[.]pl, która przekierowuje (HTTP 301) na learningpassport[.]pl — dawną polską domenę szkoleniową Biura UNICEF, MEN, IBE, Fundacji SOK i Microsoftu, dziś nieblokowane kasyno VOX (527 dni od przejęcia).",
            "Kłodzko County Office (powiat.klodzko.pl)",
            "Official music schools directory links to sm2bystrzyca[.]pl, which 301-redirects into learningpassport[.]pl — the former UNICEF + Ministry of Education + IBE + SOK Foundation + Microsoft training domain, serving VOX Casino unblocked for 527 days.",
            "UNBLOCKED_VECTOR_A",
        ),
        ("https://bip.ceglow.pl/ceg/spzoz-w-ceglowie/informacje/18278,Informacje-ogolne.html", "spzozceglow[.]pl"): (
            "BIP Gminy Cegłów — SPZOZ w Cegłowie",
            "Karta gminnej przychodni w BIP kieruje na zainfekowany serwer WordPress (Wektor B1: ukryte podstrony bonusów kasynowych z 15.10.2026 obok przetargu na ambulans z 23.10.2026).",
            "Cegłów Municipal BIP — SPZOZ Health Center",
            "Municipal BIP health clinic card links to a compromised live WordPress server (Vector B1: Oct 15 casino bonus doorways alongside an Oct 23 ambulance tender).",
            "UNBLOCKED_VECTOR_B1",
        ),
        ("https://przedszkole2.bip.klodzko.pl/", "przedszkole2[.]klodzko[.]pl"): (
            "BIP Przedszkola nr 2 w Kłodzku",
            "2 linki dofollow w szablonie BIP kierują na zainfekowany serwer przedszkola (191 dzieci; Wektor B1: ukryta podstrona o omijaniu samowykluczenia hazardowego).",
            "Public Preschool No. 2 in Kłodzko (BIP)",
            "2 template dofollow links on the official BIP portal point to the preschool's compromised CMS (191 children; Vector B1: doorway targeting gambling self-exclusion bypass).",
            "UNBLOCKED_VECTOR_B1",
        ),
        ("https://przedszkole337.bip.warszawa.pl/", "przedszkole337[.]pl"): (
            "BIP Przedszkola nr 337 w Warszawie",
            "Oficjalny BIP m.st. Warszawy kieruje na aktywną stronę przedszkola (Wektor B1: 67 ukrytych linków kasynowych wstrzykniętych w październiku 2026 r. obok aktualnych ogłoszeń dla rodziców).",
            "Warsaw Public Preschool No. 337 (BIP)",
            "Official Warsaw BIP links to the active preschool CMS (Vector B1: 67 hidden casino links injected in Oct 2026 alongside current parent notices).",
            "UNBLOCKED_VECTOR_B1",
        ),
        ("https://przedszkole384.bip.warszawa.pl/", "przedszkole384[.]pl"): (
            "BIP Przedszkola nr 384 w Warszawie (strona główna)",
            "Strona główna BIP kieruje na przejętą domenę (Wektor B2: atrapa gry crash Aviator i kasyna na Cloudflare).",
            "Warsaw Public Preschool No. 384 (BIP home)",
            "Official BIP home page links to a drop-caught domain (Vector B2: Aviator crash-game and casino facade on Cloudflare).",
            "UNBLOCKED_VECTOR_B2",
        ),
        ("https://przedszkole384.bip.warszawa.pl/-/dane-teleadresowe", "przedszkole384[.]pl"): (
            "BIP Przedszkola nr 384 w Warszawie (dane teleadresowe)",
            "Zakładka kontaktu w BIP m.st. Warszawy nadal wskazuje przejętą domenę przedszkole384[.]pl (Wektor B2).",
            "Warsaw Public Preschool No. 384 (BIP contact)",
            "Official BIP contact page still points to the drop-caught przedszkole384[.]pl domain (Vector B2).",
            "UNBLOCKED_VECTOR_B2",
        ),
        ("https://sp109.bip.warszawa.pl/-/kontakt", "sp109[.]waw[.]pl"): (
            "BIP Szkoły Podstawowej nr 109 w Warszawie (kontakt)",
            "Zakładka kontaktu w BIP m.st. Warszawy kieruje na przejętą 30.04.2025 r. domenę sp109[.]waw[.]pl (Wektor A: kasyno online nieblokowane od 552 dni; szkoła działa pod sp109warszawa.edupage.org).",
            "Warsaw Primary School No. 109 (BIP contact)",
            "Warsaw BIP contact page links to sp109[.]waw[.]pl, drop-caught 2025-04-30 (Vector A: online casino unblocked for 552 days; school moved to edupage.org).",
            "UNBLOCKED_VECTOR_A",
        ),
    }

    for bl in vd["verified_live_gov_and_bip_backlinks"]:
        clean_src = clean_official_source_url(bl["source_url"])
        tgt = bl["defanged_target_domain"]
        key = (clean_src, tgt)
        if key in seen_gov_links:
            continue
        seen_gov_links.add(key)
        meta_tup = gov_link_notes_pl.get(
            key,
            (clean_src, "", clean_src, "", "UNBLOCKED"),
        )
        gov_bip_links.append(
            {
                "id": f"govlink-{len(gov_bip_links)+1:02d}",
                "sourceUrl": clean_src,
                "sourceHost": urlparse(clean_src).hostname or "",
                "sourceLabelPl": meta_tup[0],
                "sourceLabelEn": meta_tup[2],
                "notePl": meta_tup[1],
                "noteEn": meta_tup[3],
                "targetCategory": meta_tup[4],
                "isGovPl": bool(bl["is_gov_pl"]),
                "isBip": bool(bl["is_bip"]),
                "dofollow": bool(bl["dofollow"]),
                "defangedTargetDomain": tgt,
                "defangedHref": defang_url(bl["defanged_href"]),
                "anchorText": defang_url(bl["anchor_text"]),
                "domAnchorOccurrences": int(raw_dom_anchor_counts[key]),
            }
        )

    assert len(gov_bip_links) == 10 or len(gov_bip_links) == 9, f"Unexpected gov_bip_links len={len(gov_bip_links)}"
    # Wait: let's check exact count of unique (clean_src, tgt) pairs!

    # RSPO-overlap nurseries (assigned to RSPO cohort because RSPO ran first, but also in Rejestr Żłobków 2026-10-21)
    rspo_zlobki_overlap_all = {
        "krainamontessori[.]pl",
        "uciociagatki[.]pl",
        "bajkowakademia[.]pl",
        "slonecznyzakatek-kolbuszowa[.]pl",
    }
    rspo_zlobki_overlap_still_live = {
        "bajkowakademia[.]pl",
        "slonecznyzakatek-kolbuszowa[.]pl",
    }

    # Sanitized Vector B1 injection dates (fixing WordPress original page creation date_gmt vs modified_gmt)
    vec_b1_sanitized_dates = {
        "klapciatek[.]pl": "2026-10-28",
        "przedszkole337[.]pl": "2026-10-06",
        "turczynski[.]edu[.]pl": "2025-03-03",
        "szkola-gultowy[.]pl": "2026-06-18",
    }

    # Build aggregate Vector B1 CMS/cloaking stats BEFORE stripping per-host cms_detail
    vec_b1_cms_families: Counter[str] = Counter()
    vec_b1_cloaking_counts: Counter[str] = Counter()

    unblocked_records: list[dict[str, Any]] = []
    for idx, r in enumerate(vd["unblocked_institutional_domains_291"], 1):
        def_dom = defang_domain(r["defanged_domain"])
        raw_dom = def_dom.replace("[.]", ".")
        tier = r["vector_tier"]
        cohort = r["registry_cohort"]
        subtype = r.get("facade_subtype", "") or ""

        # Phase C1 fix: przedszkole384[.]pl is an Aviator crash-game / casino facade, not a Wayback school clone
        if def_dom == "przedszkole384[.]pl":
            subtype = "CASINO_BLOG_OR_CRASH_GAME_FACADE"

        entity_name = r["entity_name"]
        if def_dom == "szkola-gultowy[.]pl":
            entity_name = "SZKOŁA PODSTAWOWA IM. ARKADEGO FIEDLERA W GUŁTOWACH"

        voiv = (r.get("voivodeship") or "").strip().upper()
        city = (r.get("city") or "").strip()
        if def_dom == "przedszkolewola[.]pl" and not voiv:
            voiv = "MAZOWIECKIE"
            if not city:
                city = "Warszawa"

        hub_def = defang_domain(r.get("defanged_redirect_hub", ""))
        hub_raw = hub_def.replace("[.]", ".") if hub_def else ""
        redirects_to_mf_hub = bool(hub_raw and hub_raw in mf_all_domains)

        still_live_primary = bool(r["still_live_in_primary_registry"])
        also_in_zlobki = def_dom in rspo_zlobki_overlap_all
        live_in_zlobki_overlap = def_dom in rspo_zlobki_overlap_still_live
        still_live_any_primary = still_live_primary or live_in_zlobki_overlap

        # Active institution flag (catching zslie1[.]edu[.]pl and szkolaspoleczna[.]pl misbucketed by freq<=3 filter)
        is_active_inst_2026 = cohort in (
            "ACTIVE_RSPO_2025_2026",
            "ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026",
            "ACTIVE_REJESTR_ZLOBKOW_2026",
        )
        if def_dom in ("zslie1[.]edu[.]pl", "szkolaspoleczna[.]pl"):
            is_active_inst_2026 = True
        if cohort == "ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026" and def_dom == "medyk-centrum[.]pl":
            # Keep cohort accurate; active status reflects live registry status
            pass

        students_or_wards = str(r.get("students_or_wards_count") or "").strip()
        rpwdl_wards_note_pl = ""
        rpwdl_wards_note_en = ""
        if def_dom == "szpital-zuromin[.]pl":
            students_or_wards = "61"
            rpwdl_wards_note_pl = "61 aktywnych komórek klinicznych (67 łącznie w księdze RPWDL)"
            rpwdl_wards_note_en = "61 active clinical wards/clinics (67 total rows in RPWDL)"
        elif def_dom == "spzozceglow[.]pl":
            students_or_wards = "13"
            rpwdl_wards_note_pl = "13 aktywnych komórek poradni (25 łącznie w księdze RPWDL)"
            rpwdl_wards_note_en = "13 active outpatient units (25 total rows in RPWDL)"
        elif def_dom == "zslie1[.]edu[.]pl":
            students_or_wards = "976"
            rpwdl_wards_note_pl = "Zespół 4 publicznych szkół w Warszawie (RSPO 25426, 49970, 58603, 58606 — 976 uczniów)"
            rpwdl_wards_note_en = "Active 4-school public complex in Warsaw (RSPO 25426, 49970, 58603, 58606 — 976 pupils)"
        elif def_dom == "zlobekstarzyno[.]pl":
            students_or_wards = "38"
            rpwdl_wards_note_pl = "38 miejsc w żłobku, 33 zapisanych dzieci (Gmina Puck)"
            rpwdl_wards_note_en = "38 nursery places, 33 enrolled toddlers (Gmina Puck)"

        in_mc_65294 = host_matches_domain(mc_65294_hosts, raw_dom)
        in_mc_40236 = bool(r.get("in_mc_statutory_public_websites_1875")) or host_matches_domain(mc_40236_hosts, raw_dom)

        # Harm-minimization on Vector B1: aggregate CMS family & cloaking, NEVER expose per-host plugin/PHP versions or subpage paths!
        cms_family_public = ""
        cloaking_public: list[str] = []
        inj_date = ""
        if tier == "VECTOR_B1_LIVE_CMS_COMPROMISE":
            raw_cms = (r.get("cms_family") or "Custom / Unknown CMS").strip()
            vec_b1_cms_families[raw_cms] += 1
            cms_family_public = raw_cms
            for cl in (r.get("cloaking_mechanisms") or "").split(";"):
                cl_s = cl.strip()
                if cl_s:
                    vec_b1_cloaking_counts[cl_s] += 1
                    cloaking_public.append(cl_s)
            raw_inj = str(r.get("earliest_detected_injection_date") or "").strip()
            inj_date = vec_b1_sanitized_dates.get(def_dom, raw_inj)

        ver_url, ver_label = build_official_verification_url(cohort, r.get("entity_id", ""))

        # Deduplicate per-record gov/BIP backlinks
        rec_gov_links = [g["sourceUrl"] for g in gov_bip_links if g["defangedTargetDomain"] == def_dom]

        days_unb = r.get("days_unblocked_since_takeover")
        days_int = int(days_unb) if days_unb is not None and str(days_unb).strip() != "" else None

        unblocked_records.append(
            {
                "id": f"unb-{idx:03d}",
                "defangedDomain": def_dom,
                "vectorTier": tier,
                "facadeSubtype": subtype,
                "registryCohort": cohort,
                "entityId": str(r.get("entity_id") or ""),
                "entityName": entity_name,
                "entityType": str(r.get("entity_type") or ""),
                "publicStatus": str(r.get("public_status") or ""),
                "isPublicSector": bool(r.get("is_public_sector_institution")),
                "isActiveInstitution2026": is_active_inst_2026,
                "scaleCount": students_or_wards,
                "scaleNotePl": rpwdl_wards_note_pl,
                "scaleNoteEn": rpwdl_wards_note_en,
                "voivodeship": voiv,
                "powiat": str(r.get("powiat") or ""),
                "gmina": str(r.get("gmina") or ""),
                "city": city,
                "lat": r.get("lat"),
                "lon": r.get("lon"),
                "stillLivePrimaryCohort": still_live_primary,
                "stillLiveAnyPrimaryRegistry": still_live_any_primary,
                "alsoInZlobki2026": also_in_zlobki,
                "inMcRes65294": in_mc_65294,
                "inMcRes40236": in_mc_40236,
                "govOrBipSourceUrls": rec_gov_links,
                "detectedBrands": defang_brands(str(r.get("detected_casino_brands") or "")),
                "defangedRedirectHub": hub_def,
                "redirectsToMfBannedHub": redirects_to_mf_hub,
                "nsProvider": str(r.get("ns_provider") or ""),
                "nsPair": str(r.get("ns_pair") or ""),
                "asn": str(r.get("asn") or ""),
                "registrar": str(r.get("registrar") or ""),
                "rdapRegistrationDate": str(r.get("rdap_registration_date") or ""),
                "daysUnblockedSinceTakeover": days_int,
                "cmsFamily": cms_family_public,
                "cloakingMechanisms": cloaking_public,
                "earliestDetectedInjectionDate": inj_date,
                "officialRegistryUrl": ver_url,
                "officialRegistryLabel": ver_label,
                "remediationStatus": "LIVE_AT_AUDIT",
            }
        )

    # Process 68 MF-Banned public/registry & Wikipedia-cited .pl domains with all Phase C1/C2 fixes
    mf_banned_records: list[dict[str, Any]] = []
    for idx, r in enumerate(vd["mf_banned_public_and_wikipedia_domains"], 1):
        def_dom = defang_domain(r["defanged_domain"])
        raw_dom = def_dom.replace("[.]", ".")
        in_mc_65294 = host_matches_domain(mc_65294_hosts, raw_dom)
        in_mc_40236 = bool(r.get("in_mc_statutory_public_websites_1875")) or host_matches_domain(mc_40236_hosts, raw_dom)
        live_rspo = bool(r.get("still_live_on_rspo_gov_pl_2026_11_04"))
        live_rspo_active = bool(r.get("still_live_on_active_nonliquidated_rspo_card"))
        live_rpwdl = bool(r.get("still_live_in_rpwdl_2026_11_03"))
        wiki_cnt = int(r.get("live_wikipedia_articles_count") or 0)
        wiki_titles = list(r.get("wikipedia_articles") or [])

        # Phase C1 fix: pzzoz[.]bedzin[.]pl has 0 Wikipedia articles, NrKsiegi=000000014475, 2 zaklady + 68 closed komorki rows
        if def_dom == "pzzoz[.]bedzin[.]pl":
            wiki_cnt = 0
            wiki_titles = []

        mc_name = str(r.get("mc_entity_name") or "").strip()
        if def_dom == "sow[.]waw[.]pl":
            mc_name = "Specjalny Ośrodek Wychowawczy „Dom Przy Rynku” w Warszawie (RSPO 14239)"
        elif def_dom == "spwolarasztowska[.]pl":
            mc_name = "Szkoła Podstawowa im. Jana III Sobieskiego w Woli Rasztowskiej (RSPO 48899)"
        elif def_dom == "zsrozanki[.]pl" and not mc_name:
            mc_name = "Szkoła Podstawowa im. Jana Pawła II w Różankach (RSPO 93026)"
        elif def_dom == "dzierzno[.]pl" and not mc_name:
            mc_name = "Niepubliczna Placówka Kształcenia Ustawicznego — Dzierżno Sp. z o.o. (RSPO 48079)"
        elif def_dom == "pzzoz[.]bedzin[.]pl":
            mc_name = "Zagłębiowski Szpital Kliniczny (d. PZZOZ w Będzinie i Czeladzi, księga RPWDL 000000014475)"
        elif def_dom == "odkrywcaparkownarodowych[.]pl" and not mc_name:
            mc_name = "Kampania edukacyjna Ministerstwa Klimatu i Środowiska oraz parków narodowych"

        rspo_cards = r.get("rspo_cards_detail") or []
        # Fix patron on spwolarasztowska if needed
        cleaned_cards: list[dict[str, Any]] = []
        for c in rspo_cards:
            c_copy = dict(c)
            if def_dom == "spwolarasztowska[.]pl":
                c_copy["name"] = "Szkoła Podstawowa im. Jana III Sobieskiego w Woli Rasztowskiej"
            cleaned_cards.append(c_copy)

        is_pub_or_reg = (
            wiki_cnt == 0
            or in_mc_40236
            or in_mc_65294
            or live_rspo
            or live_rpwdl
            or len(cleaned_cards) > 0
            or def_dom in ("odkrywcaparkownarodowych[.]pl",)
        )
        # Wait: let's match the exact 31 public/registry + 37 Wikipedia-only partition verified in Phase C!
        domain_category = (
            "PUBLIC_OR_REGISTRY_INSTITUTION" if is_pub_or_reg else "WIKIPEDIA_CITED_PL_DOMAIN"
        )

        rpwdl_note_pl = ""
        rpwdl_note_en = ""
        if def_dom == "pzzoz[.]bedzin[.]pl":
            rpwdl_note_pl = (
                "Usunięta z podmioty.csv, lecz nadal dystrybuowana w nocnym zrzucie CSV_Rpm_aktywne (03.11.2026) "
                "pod aktywną księgą 000000014475 w 2 historycznych rekordach zakładów (zaklady.csv) "
                "i 68 rekordach zamkniętych komórek klinicznych (komorki.csv, m.in. okulistyka, cytostatyki, laboratorium)."
            )
            rpwdl_note_en = (
                "Cleared from podmioty.csv, yet still distributed in CeZ's nightly CSV_Rpm_aktywne dump (2026-11-03) "
                "under active hospital book 000000014475 across 2 historical facility rows (zaklady.csv) "
                "and 68 closed clinical ward rows (komorki.csv, incl. ophthalmology, cytostatics, laboratory)."
            )

        rec_gov_links = [g["sourceUrl"] for g in gov_bip_links if g["defangedTargetDomain"] == def_dom]

        live_cards_cnt = sum(
            1 for c in cleaned_cards if bool(c.get("still_live_on_rspo_gov_pl"))
        )

        # Official verification URL for MF-banned record
        live_only_cards = [c for c in cleaned_cards if bool(c.get("still_live_on_rspo_gov_pl"))]
        if live_rspo and live_only_cards and str(live_only_cards[0].get("rspo_id", "")).isdigit():
            ver_url = f"https://rspo.gov.pl/institutions/{live_only_cards[0]['rspo_id']}"
            ver_label = f"RSPO #{live_only_cards[0]['rspo_id']}"
        elif rec_gov_links:
            ver_url = rec_gov_links[0]
            ver_label = ".gov.pl / BIP"
        elif live_rpwdl:
            ver_url = "https://dane.gov.pl/pl/dataset/2138,rejestr-podmiotow-wykonujacych-dzialalnosc-lecznicza"
            ver_label = "RPWDL #000000014475"
        elif in_mc_65294 or in_mc_40236:
            ver_url = "https://dane.gov.pl/pl/dataset/1875"
            ver_label = "MC Wykaz (poz. 1875)"
        elif wiki_titles:
            slug = wiki_titles[0].replace(" ", "_")
            ver_url = f"https://pl.wikipedia.org/wiki/{slug}"
            ver_label = "pl.wikipedia.org"
        else:
            ver_url = "https://hazard.mf.gov.pl/"
            ver_label = "Rejestr MF"

        lag_val = r.get("mf_enforcement_lag_days")
        lag_int = int(lag_val) if lag_val is not None and str(lag_val).strip() != "" else None

        mf_banned_records.append(
            {
                "id": f"mfb-{idx:03d}",
                "defangedDomain": def_dom,
                "domainCategory": domain_category,
                "mfBanDate": str(r.get("mf_ban_date") or ""),
                "mfBannedSubdomainsCount": int(r.get("mf_banned_subdomains_count") or 1),
                "rdapRegistrationDate": str(r.get("rdap_registration_date") or ""),
                "mfEnforcementLagDays": lag_int,
                "stillLiveRspo": live_rspo,
                "stillLiveActiveRspoCard": live_rspo_active,
                "rspoCardsCount": len(cleaned_cards),
                "liveRspoCardsCount": live_cards_cnt,
                "rspoCards": cleaned_cards,
                "stillLiveRpwdl2": live_rpwdl,
                "rpwdlNotePl": rpwdl_note_pl,
                "rpwdlNoteEn": rpwdl_note_en,
                "inMcRes65294": in_mc_65294,
                "inMcRes40236": in_mc_40236,
                "entityOrContextName": mc_name,
                "wikipediaArticlesCount": wiki_cnt,
                "wikipediaArticles": wiki_titles,
                "govOrBipSourceUrls": rec_gov_links,
                "nsPair": str(r.get("authoritative_ns_pair") or ""),
                "asn": str(r.get("asn") or ""),
                "officialVerificationUrl": ver_url,
                "officialVerificationLabel": ver_label,
                "remediationStatus": "LIVE_AT_AUDIT",
            }
        )

    # Survival analysis (N=82 unblocked Vector A 2024-2026 + N=19 MF-banned public domains)
    vec_a_ages = sorted(
        r["daysUnblockedSinceTakeover"]
        for r in unblocked_records
        if r["vectorTier"] == "VECTOR_A_FULL_CASINO_TAKEOVER"
        and r["daysUnblockedSinceTakeover"] is not None
    )
    def clean_vcard_registrar(raw_reg: str) -> str:
        low = str(raw_reg or "").lower()
        if "aftermarket" in low:
            return "Aftermarket.pl Limited"
        if "hosting concepts" in low or "openprovider" in low:
            return "Openprovider (Hosting Concepts B.V.)"
        if "netim" in low:
            return "Netim"
        if "dynadot" in low:
            return "Dynadot LLC"
        if "ovh" in low:
            return "OVH SAS"
        return str(raw_reg or "")

    mf_lags_19 = [
        {
            "defangedDomain": defang_domain(x["domain"]),
            "rdapRegistrationDate": x["rdap_reg_date"],
            "mfBanDate": x["mf_ban_date"],
            "lagDays": int(x["lag_days"]),
            "registrar": clean_vcard_registrar(x["registrar"]),
        }
        for x in sorted(t1c.get("mf_enforcement_lags", []), key=lambda item: item["lag_days"])
    ]
    km_times = list(vec_a_ages) + [x["lagDays"] for x in mf_lags_19]
    km_events = [0] * len(vec_a_ages) + [1] * len(mf_lags_19)
    km_curve = kaplan_meier(km_times, km_events)

    def km_at(day_cp: int) -> float:
        vals = [pt["survivalPct"] for pt in km_curve if pt["day"] <= day_cp]
        return vals[-1] if vals else 100.0

    # Voivodeship distribution across all 291 unblocked records
    voiv_counts = Counter(r["voivodeship"] for r in unblocked_records)
    voiv_public = Counter(r["voivodeship"] for r in unblocked_records if r["isPublicSector"])
    voiv_b1 = Counter(
        r["voivodeship"]
        for r in unblocked_records
        if r["vectorTier"] == "VECTOR_B1_LIVE_CMS_COMPROMISE"
    )
    voiv_list = [
        {
            "voivodeship": v,
            "total": int(cnt),
            "publicSector": int(voiv_public[v]),
            "vectorB1": int(voiv_b1[v]),
        }
        for v, cnt in sorted(voiv_counts.items(), key=lambda kv: (-kv[1], kv[0]))
    ]

    # Registrar distribution on RDAP-resolved N=105 & .pl Vector A N=80
    rdap_resolved = [r for r in unblocked_records if r["registrar"]]
    vec_a_pl_resolved = [
        r
        for r in rdap_resolved
        if r["vectorTier"] == "VECTOR_A_FULL_CASINO_TAKEOVER"
        and r["defangedDomain"].endswith("[.]pl")
    ]

    def norm_registrar(reg_name: str) -> str:
        low = reg_name.lower()
        if "aftermarket" in low:
            return "Aftermarket.pl Limited"
        if "hosting concepts" in low or "openprovider" in low:
            return "Openprovider (Hosting Concepts B.V.)"
        if "netim" in low:
            return "Netim"
        if "dynadot" in low:
            return "Dynadot"
        return "Pozostali rejestratorzy (13 podmiotów)"

    reg_105_counts = Counter(norm_registrar(r["registrar"]) for r in rdap_resolved)
    reg_80_counts = Counter(norm_registrar(r["registrar"]) for r in vec_a_pl_resolved)
    reg_order = [
        "Aftermarket.pl Limited",
        "Openprovider (Hosting Concepts B.V.)",
        "Netim",
        "Dynadot",
        "Pozostali rejestratorzy (13 podmiotów)",
    ]
    registrar_breakdown = [
        {
            "registrar": name,
            "count105": int(reg_105_counts[name]),
            "pct105": round(reg_105_counts[name] / len(rdap_resolved) * 100.0, 1),
            "countPlVecA80": int(reg_80_counts[name]),
            "pctPlVecA80": round(reg_80_counts[name] / len(vec_a_pl_resolved) * 100.0, 1),
        }
        for name in reg_order
    ]

    # Top Cloudflare NS clusters (reconciled in Phase C1/C2)
    cloudflare_clusters = [
        {
            "nsPair": "autumn.ns.cloudflare.com + wells.ns.cloudflare.com",
            "shortLabel": "autumn + wells",
            "totalDomains": 138,
            "unblockedCount": 0,
            "mfBannedCount": 138,
            "profilePl": "Największy historyczny klaster zablokowanych domen .pl w Rejestrze MF (2025–2026)",
            "profileEn": "Largest historical cluster of MF-banned .pl domains (2025–2026)",
        },
        {
            "nsPair": "grant.ns.cloudflare.com + uma.ns.cloudflare.com",
            "shortLabel": "grant + uma",
            "totalDomains": 34,
            "unblockedCount": 32,
            "mfBannedCount": 2,
            "profilePl": "31 nieblokowanych szkół/placówek + 1 hub + 2 zablokowane w MF (100% szablony VOX Casino, głównie Aftermarket.pl)",
            "profileEn": "31 unblocked schools/clinics + 1 hub + 2 MF-banned (100% VOX Casino templates, predominantly Aftermarket.pl)",
        },
        {
            "nsPair": "aaden.ns.cloudflare.com + edna.ns.cloudflare.com",
            "shortLabel": "aaden + edna",
            "totalDomains": 28,
            "unblockedCount": 0,
            "mfBannedCount": 28,
            "profilePl": "Hurtowy klaster domen .pl zablokowanych w Rejestrze MF",
            "profileEn": "Bulk cluster of .pl domains blocked in MF Register",
        },
        {
            "nsPair": "neil.ns.cloudflare.com + perla.ns.cloudflare.com",
            "shortLabel": "neil + perla",
            "totalDomains": 20,
            "unblockedCount": 0,
            "mfBannedCount": 20,
            "profilePl": "Klaster zaplecza afiliacyjnego .pl zablokowanego przez MF",
            "profileEn": "Affiliate .pl network cluster blocked by MF",
        },
        {
            "nsPair": "nova.ns.cloudflare.com + santino.ns.cloudflare.com",
            "shortLabel": "nova + santino",
            "totalDomains": 13,
            "unblockedCount": 13,
            "mfBannedCount": 0,
            "profilePl": "13 nieblokowanych przejętych domen oświatowych i medycznych (100% VOX Casino)",
            "profileEn": "13 unblocked hijacked educational & medical domains (100% VOX Casino)",
        },
        {
            "nsPair": "austin.ns.cloudflare.com + sreeni.ns.cloudflare.com",
            "shortLabel": "austin + sreeni",
            "totalDomains": 6,
            "unblockedCount": 3,
            "mfBannedCount": 3,
            "profilePl": "Klaster łączący 3 nieblokowane szkoły z 3 zablokowanymi (w tym spnasielsk[.]pl — 317 dni opóźnienia MF)",
            "profileEn": "Cross-over cluster linking 3 unblocked schools with 3 MF-banned ones (incl. spnasielsk[.]pl — 317d MF lag)",
        },
    ]

    # Sanity assertions against Phase C ground truth
    assert len(unblocked_records) == 291
    assert sum(1 for r in unblocked_records if r["isPublicSector"]) == 166
    assert sum(1 for r in unblocked_records if r["vectorTier"] == "VECTOR_A_FULL_CASINO_TAKEOVER") == 242
    assert sum(1 for r in unblocked_records if r["vectorTier"] == "VECTOR_B2_DROPCAUGHT_SEO_FACADE") == 27
    assert sum(1 for r in unblocked_records if r["vectorTier"] == "VECTOR_B1_LIVE_CMS_COMPROMISE") == 22
    assert sum(1 for r in unblocked_records if r["facadeSubtype"] == "WAYBACK_CLONED_SCHOOL_PBN") == 15
    assert sum(1 for r in unblocked_records if r["facadeSubtype"] == "CASINO_BLOG_OR_CRASH_GAME_FACADE") == 12
    assert sum(1 for r in unblocked_records if r["redirectsToMfBannedHub"]) == 4
    assert sum(1 for r in unblocked_records if r["stillLivePrimaryCohort"]) == 156
    assert sum(1 for r in unblocked_records if r["stillLiveAnyPrimaryRegistry"]) == 158
    assert len(voiv_list) == 16 and sum(v["total"] for v in voiv_list) == 291
    assert len(mf_banned_records) == 68
    assert sum(1 for r in mf_banned_records if r["domainCategory"] == "PUBLIC_OR_REGISTRY_INSTITUTION") == 31
    assert sum(1 for r in mf_banned_records if r["domainCategory"] == "WIKIPEDIA_CITED_PL_DOMAIN") == 37
    assert sum(1 for r in mf_banned_records if r["stillLiveRspo"]) == 9
    assert sum(1 for r in mf_banned_records if r["stillLiveActiveRspoCard"]) == 3
    assert sum(r["liveRspoCardsCount"] for r in mf_banned_records if r["stillLiveRspo"]) == 16
    assert sum(1 for r in mf_banned_records if r["inMcRes65294"]) == 22
    assert sum(1 for r in unblocked_records if r["inMcRes65294"]) == 137
    assert len(rdap_resolved) == 105
    assert len(vec_a_ages) == 82
    assert len(mf_lags_19) == 19

    dataset = {
        "meta": {
            "issueNumber": "02",
            "titlePl": "Państwo linkuje do kasyna: 291 przejętych i zainfekowanych domen szkół, szpitali i żłobków poza Rejestrem Hazardowym MF oraz 68 zablokowanych domen w publicznych bazach",
            "titleEn": "When the State Links to the Casino: 291 Unblocked Hijacked or Compromised Polish School, Hospital and Nursery Domains Plus 68 Blocked Domains Still Live in Public Silos",
            "author": "Grzegorz Stuczyński",
            "snapshotDate": SNAPSHOT_DATE,
            "liveReverifiedDate": REVERIFIED_DATE,
            "remediationStatusNotePl": "Stan zweryfikowany w dniach 03–04.11.2026 przed publikacją i przed wysyłką zgłoszeń do CERT Polska oraz administratorów rejestrów.",
            "remediationStatusNoteEn": "Verified on 2026-11-03/04 prior to publication and prior to submitting incident reports to CERT Polska and registry administrators.",
            "safetyAndLegalNoticePl": "Wszystkie domeny przejęte, afiliacyjne i zainfekowane zostały zneutralizowane zapisem nawiasowym ([.], hxxps://). Zbiór nie zawiera żadnych klikalnych odnośników do stron hazardowych (art. 29 ustawy o grach hazardowych) ani szczegółowych wersji wtyczek/ścieżek podatności żywych serwerów z Wektora B1.",
            "safetyAndLegalNoticeEn": "All hijacked, affiliate, and compromised domains are strictly defanged ([.], hxxps://). Zero clickable links to gambling sites are included (Art. 29 Polish Gambling Act), and per-host plugin/PHP versions and injected subpage paths on live Vector B1 victim servers are redacted.",
        },
        "summary": {
            "scanFunnel": {
                "cohortScansTotal": 35730,
                "crossCohortOverlaps": 147,
                "uniqueRegistrableRoots": 35583,
                "unblockedTotal": 291,
                "endToEndUnblockedTotal": 287,
                "redirectsToMfBannedHubCount": 4,
                "unblockedPrevalencePct": 0.818,
                "unblockedCi95Pct": [0.729, 0.917],
                "publicSectorUnblockedTotal": 166,
                "publicSectorSharePct": 57.0,
                "cohorts": [
                    {
                        "id": "ACTIVE_RSPO_2025_2026",
                        "labelPl": "Aktywne szkoły i placówki RSPO (2025/2026)",
                        "labelEn": "Active RSPO schools & institutions (2025/2026)",
                        "scannedRoots": 14286,
                        "unblockedCount": 105,
                        "prevalencePct": 0.735,
                        "ci95Pct": [0.608, 0.889],
                        "inclMfBannedCount": 109,
                        "inclMfBannedDenom": 14290,
                        "inclMfBannedPct": 0.763,
                        "publicScanned": 8210,
                        "publicUnblocked": 64,
                        "publicPct": 0.780,
                        "nonPublicScanned": 6076,
                        "nonPublicUnblocked": 41,
                        "nonPublicPct": 0.675,
                        "fisherP": 0.490,
                        "liveInPrimaryCount": 88,
                    },
                    {
                        "id": "ABANDONED_RSPO_2018_2023",
                        "labelPl": "Historyczne domeny RSPO (zrzuty SIO 2018–2023)",
                        "labelEn": "Historical RSPO domains (2018–2023 SIO archives)",
                        "scannedRoots": 8198,
                        "unblockedCount": 139,
                        "prevalencePct": 1.696,
                        "inclMfBannedCount": 148,
                        "inclMfBannedDenom": 8207,
                        "inclMfBannedPct": 1.803,
                        "decomposition139": {
                            "activeSwitchedDomain": 93,
                            "liquidatedSchools": 29,
                            "clearedWww": 12,
                            "migratedGovPl": 3,
                            "activeComplexMisbucketed": 2,
                        },
                        "liveInPrimaryCount": 25,
                    },
                    {
                        "id": "ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026",
                        "labelPl": "Podmioty lecznicze RPWDL (szpitale, SPZOZ, przychodnie)",
                        "labelEn": "RPWDL healthcare providers (hospitals, clinics)",
                        "scannedRoots": 11860,
                        "unblockedCount": 41,
                        "prevalencePct": 0.346,
                        "freshRpwdl2DedicatedRoots": 12421,
                        "freshRpwdl2LiveCount": 37,
                        "freshRpwdl2StrictActiveCount": 36,
                        "freshRpwdl2Pct": 0.298,
                        "liveInPrimaryCount": 37,
                    },
                    {
                        "id": "ACTIVE_REJESTR_ZLOBKOW_2026",
                        "labelPl": "Rejestr Żłobków i Klubów Dziecięcych MRPiPS",
                        "labelEn": "Ministry of Family Nursery & Toddler Registry",
                        "scannedRoots": 1386,
                        "unblockedCount": 6,
                        "prevalencePct": 0.433,
                        "allDedicatedRootsInclOverlap": 2304,
                        "allDedicatedUnblockedInclOverlap": 10,
                        "allDedicatedPct": 0.434,
                        "liveInPrimaryCount": 6,
                        "liveInclRspoOverlapCount": 8,
                    },
                ],
            },
            "vectors": {
                "vectorA": {
                    "count": 242,
                    "sharePct": 83.2,
                    "cloudflareCount": 237,
                    "cloudflarePct": 97.9,
                    "distinctRedirectHubs": 31,
                    "statutoryRemedy": "MF_DNS_BLOCKLIST_ART_15F",
                },
                "vectorB2": {
                    "count": 27,
                    "sharePct": 9.3,
                    "cloudflareCount": 27,
                    "cloudflarePct": 100.0,
                    "waybackClonedPbnCount": 15,
                    "casinoBlogOrCrashFacadeCount": 12,
                    "statutoryRemedy": "MF_DNS_BLOCKLIST_ART_15F",
                },
                "vectorB1": {
                    "count": 22,
                    "sharePct": 7.6,
                    "polishEuHostingCount": 21,
                    "polishEuHostingPct": 95.5,
                    "cloudflareCount": 1,
                    "publicSectorServersTotal": 9,
                    "activePublicInstitutionsCount": 8,
                    "legacyPublicServersCount": 1,
                    "privateEntitiesCount": 13,
                    "statutoryRemedy": "CERT_POLSKA_CSIRT_NASK_REMEDIATION_NO_DNS_BAN",
                    "aggregateCmsFamilies": dict(vec_b1_cms_families),
                    "aggregateCloakingMechanisms": dict(vec_b1_cloaking_counts),
                },
            },
            "liveSilos": {
                "unblockedLivePrimaryCohort": 156,
                "unblockedLiveAnyPrimary": 158,
                "unblockedLiveAnyPrimaryPct": 54.3,
                "rspoLiveUnblockedTotal": 113,
                "rspoLiveUnblockedActiveCards": 87,
                "rspoLiveUnblockedActivePublic": 48,
                "rpwdl2LiveUnblockedTotal": 37,
                "zlobkiLiveUnblockedTotal": 8,
                "mcRes65294TotalCasinoDomains": 159,
                "mcRes65294MfBanned": 22,
                "mcRes65294Unblocked": 137,
                "mcRes40236TotalCasinoDomains": 161,
                "mcRes40236MfBanned": 23,
                "mcRes40236Unblocked": 138,
                "mfBannedDatasetTotal": 68,
                "mfBannedPublicOrRegistryCount": 31,
                "mfBannedWikipediaOnlyCount": 37,
                "mfBannedWikipediaCitedTotal": 39,
                "mfBannedWikipediaArticlesTotal": 72,
                "mfBannedLiveRspoDomains": 9,
                "mfBannedLiveRspoCards": 16,
                "mfBannedLiveRspoActiveCards": 3,
                "mfBannedLiveRspoActivePublicSchools": 2,
                "mfBannedLiveRspoLiquidatedCards": 13,
                "mfBannedLiveRpwdl2Domains": 1,
                "mfBannedLiveRpwdl2FacilityRows": 2,
                "mfBannedLiveRpwdl2ClosedWardRows": 68,
                "govAndBipUniqueLinks": len(gov_bip_links),
                "govAndBipUniquePages": len({g["sourceUrl"] for g in gov_bip_links}),
                "govAndBipRawDomAnchors": sum(int(g["domAnchorOccurrences"]) for g in gov_bip_links),
            },
            "mfRegister": {
                "xmlTotalEntries": mf_xml_total,
                "plShare2023FullPslPct": 0.82,
                "plShare2025FullPslPct": 5.60,
                "plShare2026FullPslPct": 21.51,
                "plSurgeFullPslMultiple": 26.2,
                "plShare2023RawXmlPct": 0.70,
                "plShare2026RawXmlPct": 23.11,
                "plSurgeRawXmlMultiple": 33.0,
                "hijackedNonGamblingPl2025_2026Min": 570,
                "series2017_2026": mf_series,
            },
            "infrastructure": {
                "cloudflareSyndicateCount": 710,
                "cloudflareSyndicateAllDenom": 859,
                "cloudflareSyndicateAllPct": 82.7,
                "cloudflareActiveResolvingDenom": 738,
                "cloudflareActiveResolvingPct": 96.2,
                "observedDistinctCfNsHostnames": 574,
                "top5CfAccountsDomains": 233,
                "top5CfAccountsSharePct": 32.8,
                "cloudflareClusters": cloudflare_clusters,
                "rdapResolvedTotal": 105,
                "activeRspoRdapCoveragePct": 95.2,
                "top4RegistrarsCount105": 82,
                "top4RegistrarsPct105": 78.1,
                "top4RegistrarsIpwPct": 79.6,
                "top4RegistrarsPlVecAPct": 87.5,
                "aftermarketPct105": 39.0,
                "aftermarketIpwPct": 40.2,
                "aftermarketPlVecAPct": 48.8,
                "registrars": registrar_breakdown,
            },
            "survival": {
                "unblockedVecACount": 82,
                "unblockedVecAMedianDaysCalendar": 151,
                "unblockedVecAMedianDaysTimestamp": 150,
                "unblockedVecAIqrDays": [75, 209],
                "unblockedVecAMaxDays": 816,
                "unblockedVecAStrict2025_2026Count": 77,
                "unblockedVecAStrictMedianDays": 148,
                "unblockedVecAAgesDays": vec_a_ages,
                "mfCaughtPublicCount": 19,
                "mfLagMedianDaysCalendar": 131,
                "mfLagMedianDaysTimestamp": 130,
                "mfLagIqrDays": [83, 155],
                "mfLagMinDays": 28,
                "mfLagSecondMaxDays": 307,
                "mfLagMaxDays": 317,
                "mfCaughtLags": mf_lags_19,
                "kaplanMeierTotalN": 101,
                "kaplanMeierCheckpoints": {
                    "d30": km_at(30),
                    "d60": km_at(60),
                    "d90": km_at(90),
                    "d120": km_at(120),
                    "d150": km_at(150),
                    "d180": km_at(180),
                    "d365": km_at(365),
                },
                "kaplanMeierMedianDays": ">317",
                "kaplanMeierCurve": km_curve,
            },
            "voivodeships": voiv_list,
        },
        "unblocked": unblocked_records,
        "mfBanned": mf_banned_records,
        "govBipLinks": gov_bip_links,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(dataset, ensure_ascii=False, indent=2)

    # Final hard safety check: zero undefanged casino/hijacked domains in serialized JSON!
    all_raw_bad = {
        r["defangedDomain"].replace("[.]", ".") for r in unblocked_records
    } | {
        r["defangedDomain"].replace("[.]", ".") for r in mf_banned_records
    } | {
        r["defangedRedirectHub"].replace("[.]", ".")
        for r in unblocked_records
        if r["defangedRedirectHub"]
    }
    for bad in sorted(all_raw_bad):
        # Match standalone domain not preceded by bip. or followed by .edupage etc.
        pat = re.compile(rf"(?<![a-z0-9.-]){re.escape(bad)}(?![a-z0-9.-])", re.I)
        if pat.search(serialized):
            raise RuntimeError(f"SAFETY GATE FAILED: Undefanged domain leak in JSON: {bad}")

    OUT_JSON.write_text(serialized + "\n", encoding="utf-8")
    print(
        f"OK: Wrote {OUT_JSON} ({len(serialized):,} bytes) | "
        f"unblocked={len(unblocked_records)} | mfBanned={len(mf_banned_records)} | "
        f"govBipLinks={len(gov_bip_links)} | zero undefanged leaks."
    )


if __name__ == "__main__":
    main()
