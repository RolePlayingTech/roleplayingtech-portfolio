#!/usr/bin/env python3
"""Reproducible BZP AI Procurement Audit & ETL Script (2024-2026).

Standard-library-only Python 3 pipeline that audits, enriches, and atomically writes
`assets/lab/bzp-ai-2024-2026.json` (snapshot date: 2026-11-03).

Key audit stages:
1. Matches `TenderResultNotice` and `NoticeUpdateNotice` records from the official
   BZP API (`https://ezamowienia.gov.pl/mo-board/api/v1/notice`) by `tenderId` in
   Python (working around the BZP API quirk where `TenderId` query parameter is
   ignored server-side) and splits date ranges whenever `PageSize=500` is saturated.
2. Parses `htmlBody` sections (2.11 / 2.14 EU flag, 4.x lot scopes & CPVs, 5.1 outcome,
   6.1 bids per lot, 6.4 winning bid vs 8.2 signed contract value, 7.3.1 vendor,
   8.1 contract signature date).
3. Isolates AI-specific lots in multi-topic proceedings where non-AI lots have
   separable award sections, and applies a consistent non-additive bid rule
   (`max` bids submitted across AI lots) with full per-lot notes in `lotsInfo`.
4. Flags inseparable multi-domain contracts (`aiScope: "mixed"`) across construction,
   physical security, heavy diagnostic/optical/audio hardware, and broad enterprise IT
   bundles, with factual bilingual notes (`scopeNotePl`, `scopeNoteEn`).
5. Normalizes whitespace, completes truncated CPV descriptions from official BZP
   notices, strips glued addresses/NIP/REGON from contractor names, and standardizes
   Polish legal-form suffixes (`Sp. z o.o.`, `S.A.`, `P.S.A.`, `S.K.A.`, `Sp. j.`, `Sp. k.`).
6. Validates all 171 records against strict schema assertions and writes output
   atomically via `.tmp.json` + `os.replace`.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timedelta
from html import unescape
import json
import os
from pathlib import Path
import re
import statistics
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

SNAPSHOT_DATE = "2026-11-03"
BZP_API_BASE = "https://ezamowienia.gov.pl/mo-board/api/v1/notice"
BZP_DETAILS_PREFIX = "https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/"
PAGE_SIZE = 500
POLITE_DELAY_SEC = 1.2

# Official full CPV labels verified in BZP notices for truncated descriptions
CPV_COMPLETIONS: dict[str, str] = {
    "22200000-2 (Gazety": "22200000-2 (Gazety, dzienniki, czasopisma i magazyny)",
    "38000000-5 (Sprzęt laboratoryjny": (
        "38000000-5 (Sprzęt laboratoryjny, optyczny i precyzyjny (z wyjątkiem szklanego))"
    ),
    "31700000-3 (Urządzenia elektroniczne": (
        "31700000-3 (Urządzenia elektroniczne, elektromechaniczne i elektrotechniczne)"
    ),
    "72000000-5 (Usługi informatyczne: konsultacyjne": (
        "72000000-5 (Usługi informatyczne: konsultacyjne, opracowywania oprogramowania, internetowe i wsparcia)"
    ),
}

# Category reclassifications verified against full BZP lot descriptions & CPVs
CATEGORY_OVERRIDES: dict[str, str] = {
    # 6-lot KPO hospital package where clinical/patient AI software & cloud (663.7k PLN, 52.0%)
    # exceed hardware (AI server + monitors: 474.7k PLN, 37.2%); largest lot is AI medical docs (490.8k PLN).
    "2026/BZP 00124082": "software_deploy",
    # 3-lot stage-audio hardware tenders (CPV 32342410-9 Sprzęt dźwiękowy, 31711120-0 Przetworniki),
    # aligning editions #2 and #3 with edition #1 (2025/BZP 00387604, already hardware_lab).
    "2025/BZP 00462052": "hardware_lab",
    "2025/BZP 00398324": "hardware_lab",
}

# Multi-lot proceedings where separable non-AI lots or clerical 8.2 repetitions are corrected
# Keys are canonical `bzp` field values in the dataset.
LOT_ISOLATION_OVERRIDES: dict[str, dict[str, Any]] = {
    "2026/BZP 00304575": {
        "amountPln": 16684.0,
        "bids": 10,
        "contractDate": "2026-06-22",
        "contractors": ["Karina Lniska"],
        "lotsInfo": {
            "totalLots": 3,
            "aiLots": 1,
            "fullProceedingAmountPln": 34823.0,
            "bidsNotePl": "tylko Zadanie 2 AI (10 ofert); wszystkie 3 zadania: 34 823 zł",
            "bidsNoteEn": "AI Lot 2 only (10 bids); all 3 lots: 34,823 PLN",
        },
        "scopeNotePl": (
            "Wydzielono wyłącznie Zadanie 2 dotyczące AI w administracji (16 684 zł, 10 ofert); "
            "wyłączono Zadanie 1 (wypalenie zawodowe, 9 015 zł) i Zadanie 3 (kosztorysowanie Norma Pro, 9 124 zł)."
        ),
        "scopeNoteEn": (
            "Isolated Lot 2 on AI in public administration (16,684 PLN, 10 bids); "
            "excluded Lot 1 (burnout, 9,015 PLN) and Lot 3 (Norma Pro cost estimation, 9,124 PLN)."
        ),
    },
    "2024/BZP 00007399": {
        "amountPln": 1482.0,
        "bids": 2,
        "contractDate": "2023-12-14",
        "contractors": ["Instytut Innowacyjnej Edukacji Sp. z o.o."],
        "lotsInfo": {
            "totalLots": 3,
            "aiLots": 1,
            "fullProceedingAmountPln": 5082.0,
            "bidsNotePl": "tylko Część 3 AI (2 oferty); z Częścią 1 (negocjacje): 5 082 zł",
            "bidsNoteEn": "AI Lot 3 only (2 bids); incl. Lot 1 (negotiations): 5,082 PLN",
        },
        "scopeNotePl": (
            "Wydzielono Część 3 (AI i ChatGPT w dydaktyce: 1 482 zł, 2 oferty); wyłączono Część 1 "
            "(techniki negocjacyjne: 3 600 zł, 1 oferta), a Część 2 (karty wyboru profesji) unieważniono."
        ),
        "scopeNoteEn": (
            "Isolated Lot 3 (AI & ChatGPT in university teaching: 1,482 PLN, 2 bids); excluded Lot 1 "
            "(negotiation skills: 3,600 PLN, 1 bid), while Lot 2 (career cards) was cancelled."
        ),
    },
    "2025/BZP 00133931": {
        "amountPln": 143712.0,
        "bids": 6,
        "contractDate": "2025-02-25",
        "contractors": ["New Life Property Sp. z o.o."],
        "lotsInfo": {
            "totalLots": 3,
            "aiLots": 1,
            "fullProceedingAmountPln": 567090.63,
            "bidsNotePl": "tylko Zadanie 3 pracownia AI (6 ofert); 3 zadania łącznie: 567 091 zł",
            "bidsNoteEn": "AI lab Lot 3 only (6 bids); all 3 lots combined: 567,091 PLN",
        },
        "scopeNotePl": (
            "Wydzielono Zadanie 3 (pomoce dydaktyczne do pracowni AI: drony, roboty VR, drukarki 3D — 143 712 zł, 6 ofert); "
            "wyłączono Zadanie 2 (pracownia OZE: 357 567,15 zł, 4 oferty) oraz wspólne Zadanie 1 (ogólny sprzęt IT dla pracowni i gabinetów psychologa/pedagoga: 65 811,48 zł, 18 ofert)."
        ),
        "scopeNoteEn": (
            "Isolated Lot 3 (AI lab teaching equipment: drones, VR educational robots, 3D printers — 143,712 PLN, 6 bids); "
            "excluded Lot 2 (renewable-energy lab: 357,567.15 PLN, 4 bids) and shared Lot 1 (general school laptops/tablets/monitors across labs & counseling rooms: 65,811.48 PLN, 18 bids)."
        ),
    },
    "2026/BZP 00200063": {
        "amountPln": 8900.28,
        "bids": 5,
        "contractDate": "2026-06-12",
        "contractors": ["Zoneo Oleksiewicz S.K.A."],
        "lotsInfo": {
            "totalLots": 2,
            "aiLots": 1,
            "fullProceedingAmountPln": 54139.68,
            "bidsNotePl": "tylko Część 2 słuchawki AI (5 ofert); z Częścią 1 (30 tabletów): 54 140 zł",
            "bidsNoteEn": "AI earbuds Lot 2 only (5 bids); incl. Lot 1 (30 tablets): 54,140 PLN",
        },
        "scopeNotePl": (
            "Wydzielono Część 2 (6 słuchawek dokanałowych z tłumaczeniem AI: 8 900,28 zł, 5 ofert); "
            "wyłączono Część 1 (30 standardowych tabletów z akcesoriami: 45 239,40 zł, 15 ofert)."
        ),
        "scopeNoteEn": (
            "Isolated Lot 2 (6 in-ear AI translation earbuds: 8,900.28 PLN, 5 bids); "
            "excluded Lot 1 (30 standard tablets with accessories: 45,239.40 PLN, 15 bids)."
        ),
    },
    "2025/BZP 00177761": {
        "amountPln": 157520.0,
        "bids": 5,
        "contractDate": "2025-05-28",
        "contractors": ["Instytut Innowacyjnej Edukacji Sp. z o.o."],
        "lotsInfo": {
            "totalLots": 3,
            "aiLots": 2,
            "fullProceedingAmountPln": 236280.0,
            "bidsNotePl": "Części 2–3 AI (4 i 5 ofert); z Częścią 1 (cyberbezpieczeństwo): 236 280 zł",
            "bidsNoteEn": "AI Lots 2–3 (4 & 5 bids); incl. Lot 1 (cybersecurity): 236,280 PLN",
        },
        "scopeNotePl": (
            "Wydzielono Części 2 i 3 dotyczące AI dla kadry akademickiej (2 × 78 760 zł = 157 520 zł; 4 i 5 ofert); "
            "wyłączono Część 1 dotyczącą cyberbezpieczeństwa w uczelni (78 760 zł, 4 oferty)."
        ),
        "scopeNoteEn": (
            "Isolated AI training Lots 2 & 3 for academic staff (2 × 78,760 PLN = 157,520 PLN; 4 and 5 bids); "
            "excluded Lot 1 on university cybersecurity (78,760 PLN, 4 bids)."
        ),
    },
    "2026/BZP 00213280": {
        "amountPln": 32668.80,
        "bids": 3,
        "contractDate": "2026-04-14",
        "contractors": ["VOLVOX Consulting Bartłomiej Czauderna"],
        "lotsInfo": {
            "totalLots": 4,
            "aiLots": 1,
            "fullProceedingAmountPln": 89037.94,
            "bidsNotePl": "tylko Część 1 audyt KPO (3 oferty); z Częściami 3–4 (SZBI/cyber): 89 038 zł",
            "bidsNoteEn": "KPO audit Lot 1 only (3 bids); incl. Lots 3–4 (ISMS/cyber): 89,038 PLN",
        },
        "scopeNotePl": (
            "Wydzielono Część 1 (audyt końcowy projektu KPO D1.1.2 obejmującego cyfryzację szpitala, cyberbezpieczeństwo i AI: 32 668,80 zł, 3 oferty); "
            "wyłączono czysto nie-AI Część 3 (SZBI: 36 900 zł) i Część 4 (e-learning cyber: 19 469,14 zł), a Część 2 unieważniono."
        ),
        "scopeNoteEn": (
            "Isolated Lot 1 (final audit of KPO D1.1.2 hospital digitalization, cybersecurity & AI project: 32,668.80 PLN, 3 bids); "
            "excluded non-AI Lot 3 (ISMS: 36,900 PLN) and Lot 4 (cybersecurity e-learning: 19,469.14 PLN); Lot 2 was cancelled."
        ),
    },
    "2024/BZP 00014936": {
        # Sum of winning bids across all 3 AI lots in section 6.4 (209,100 + 185,607 + 73,800 = 468,507 PLN).
        # Section 8.2 repeated the combined contract total (468,507 PLN) three times, causing 1,405,521 PLN.
        "amountPln": 468507.0,
        "bids": 1,
        "contractDate": "2023-12-07",
        "contractors": ["net-o-logy Sp. z o.o."],
        "lotsInfo": {
            "totalLots": 3,
            "aiLots": 3,
            "fullProceedingAmountPln": 468507.0,
            "bidsNotePl": "3 części AI (1 / 1 / 1 oferta); skorygowano 3× powtórzoną kwotę 468 507 zł w sekcji 8.2",
            "bidsNoteEn": "3 AI lots (1 / 1 / 1 bid); corrected 3× repeated 468,507 PLN contract total in section 8.2",
        },
        "scopeNotePl": (
            "Skorygowano wartość z 1 405 521 zł do faktycznej kwoty łącznej umowy 468 507 zł (suma ofert z sekcji 6.4: "
            "209 100 + 185 607 + 73 800 zł; zamawiający wpisał łączną wartość umowy 468 507 zł trzykrotnie w sekcji 8.2 każdej części)."
        ),
        "scopeNoteEn": (
            "Corrected from 1,405,521 PLN to the actual combined contract total of 468,507 PLN (sum of winning bids in section 6.4: "
            "209,100 + 185,607 + 73,800 PLN; the authority repeated the 468,507 PLN combined total in section 8.2 of all 3 lots)."
        ),
    },
}

# Metadata for all remaining multi-lot proceedings (where all awarded lots belong to the same scope)
OTHER_MULTILOT_INFO: dict[str, dict[str, Any]] = {
    "2026/BZP 00510375": {
        "totalLots": 3,
        "aiLots": 3,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "3 części AI (sprzęt lab. AI, klaster AI, wyposażenie spec.)",
        "bidsNoteEn": "3 AI lots (AI lab gear, AI cluster, specialized lab gear)",
    },
    "2026/BZP 00488515": {
        "totalLots": 5,
        "aiLots": 1,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "5 części (Cz. 1 lab. AI, Cz. 2–5 lab. immersyjne)",
        "bidsNoteEn": "5 lots (Lot 1 AI lab, Lots 2–5 immersive lab)",
    },
    "2026/BZP 00474618": {
        "totalLots": 2,
        "aiLots": 2,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "2 części AI/robotyka (robot-awatar 3D + manipulator UGV)",
        "bidsNoteEn": "2 AI/robotics lots (3D avatar robot + UGV manipulator)",
    },
    "2026/BZP 00465518": {
        "totalLots": 3,
        "aiLots": 3,
        "fullProceedingAmountPln": 7200.0,
        "bidsNotePl": "23 / 15 / 22 oferty w 3 częściach (maks. 23)",
        "bidsNoteEn": "23 / 15 / 22 bids across 3 lots (max 23)",
    },
    "2026/BZP 00454813": {
        "totalLots": 7,
        "aiLots": 2,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "7 części (Cz. 1 i 6 lab. AI, pozostałe lab. immersyjne/MR)",
        "bidsNoteEn": "7 lots (Lots 1 & 6 AI lab, remaining lots immersive/MR lab)",
    },
    "2026/BZP 00306468": {
        "totalLots": 3,
        "aiLots": 3,
        "fullProceedingAmountPln": 396055.08,
        "bidsNotePl": "3 / 1 / 1 oferta w 3 częściach (serwer AI + 4 zestawy PC)",
        "bidsNoteEn": "3 / 1 / 1 bids across 3 lots (AI server + 4 PC sets)",
    },
    "2026/BZP 00172386": {
        "totalLots": 2,
        "aiLots": 2,
        "fullProceedingAmountPln": 541077.0,
        "bidsNotePl": "1 / 1 oferta w 2 zadaniach badawczych AI",
        "bidsNoteEn": "1 / 1 bid across 2 AI research lots",
    },
    "2026/BZP 00167796": {
        "totalLots": 2,
        "aiLots": 0,
        "fullProceedingAmountPln": 156271.5,
        "bidsNotePl": "Część 1: 4 oferty (umowa); Część 2: 1 oferta (unieważniona)",
        "bidsNoteEn": "Lot 1: 4 bids (awarded); Lot 2: 1 bid (cancelled)",
    },
    "2026/BZP 00160577": {
        "totalLots": 3,
        "aiLots": 3,
        "fullProceedingAmountPln": 353758.77,
        "bidsNotePl": "Pakiety 1 i 3: po 1 ofercie (umowy); Pakiet 2 unieważniony",
        "bidsNoteEn": "Packages 1 & 3: 1 bid each (awarded); Package 2 cancelled",
    },
    "2026/BZP 00156906": {
        "totalLots": 4,
        "aiLots": 4,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "4 części eksperckie AI — wszystkie unieważnione (art. 255 pkt 6)",
        "bidsNoteEn": "4 AI expert lots — all cancelled (Art. 255(6))",
    },
    "2026/BZP 00141601": {
        "totalLots": 3,
        "aiLots": 2,
        "fullProceedingAmountPln": 285360.0,
        "bidsNotePl": "Części 2–3 integracja PUI AI: po 1 ofercie; Część 1 (PACS) unieważniona",
        "bidsNoteEn": "Lots 2–3 PUI AI integration: 1 bid each; Lot 1 (PACS) cancelled",
    },
    "2026/BZP 00124082": {
        "totalLots": 6,
        "aiLots": 3,
        "fullProceedingAmountPln": 1275295.98,
        "bidsNotePl": "1 / 2 / 3 / 1 / 1 / 1 oferta w 6 częściach (maks. 3 w Cz. 3)",
        "bidsNoteEn": "1 / 2 / 3 / 1 / 1 / 1 bids across 6 lots (max 3 in Lot 3)",
    },
    "2026/BZP 00100988": {
        "totalLots": 3,
        "aiLots": 2,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "3 części (PACS + 2× integracja PUI AI) — wszystkie unieważnione",
        "bidsNoteEn": "3 lots (PACS + 2× PUI AI integration) — all cancelled",
    },
    "2025/BZP 00624830": {
        "totalLots": 2,
        "aiLots": 2,
        "fullProceedingAmountPln": 8600.0,
        "bidsNotePl": "12 / 12 ofert w 2 częściach szkoleniowych AI",
        "bidsNoteEn": "12 / 12 bids across 2 AI training lots",
    },
    "2025/BZP 00495969": {
        "totalLots": 2,
        "aiLots": 0,
        "fullProceedingAmountPln": 85811.73,
        "bidsNotePl": "6 / 5 ofert w 2 zadaniach wyjazdowych (maks. 6)",
        "bidsNoteEn": "6 / 5 bids across 2 student-trip lots (max 6)",
    },
    "2025/BZP 00462052": {
        "totalLots": 3,
        "aiLots": 2,
        "fullProceedingAmountPln": 378668.73,
        "bidsNotePl": "1 / 1 / 1 oferta w 3 częściach (odsłuch, dźwięk AI, przetworniki)",
        "bidsNoteEn": "1 / 1 / 1 bid across 3 lots (monitoring, AI audio, converters)",
    },
    "2025/BZP 00398324": {
        "totalLots": 3,
        "aiLots": 2,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "1 / 1 / 1 oferta w 3 częściach — wszystkie unieważnione",
        "bidsNoteEn": "1 / 1 / 1 bid across 3 lots — all cancelled",
    },
    "2025/BZP 00387604": {
        "totalLots": 3,
        "aiLots": 2,
        "fullProceedingAmountPln": None,
        "bidsNotePl": "3 części (0 ofert) — wszystkie unieważnione",
        "bidsNoteEn": "3 lots (0 bids) — all cancelled",
    },
    "2024/BZP 00627006": {
        "totalLots": 2,
        "aiLots": 2,
        "fullProceedingAmountPln": 99495.0,
        "bidsNotePl": "9 / 6 ofert w 2 częściach analitycznych AI/ML (maks. 9)",
        "bidsNoteEn": "9 / 6 bids across 2 AI/ML data-specialist lots (max 9)",
    },
    "2024/BZP 00014935": {
        "totalLots": 2,
        "aiLots": 2,
        "fullProceedingAmountPln": 141450.0,
        "bidsNotePl": "1 / 1 oferta w 2 częściach (zasilanie UPS + czujniki serwerowni AI/ML)",
        "bidsNoteEn": "1 / 1 bid across 2 lots (UPS power + AI/ML server room sensors)",
    },
}

# Inseparable multi-domain contracts flagged as `aiScope: "mixed"` with factual bilingual explanations
MIXED_SCOPE_NOTES: dict[str, tuple[str, str]] = {
    "2026/BZP 00163288": (
        "Wspólny ryczałt w formule „zaprojektuj i wybuduj” obejmuje dokumentację projektową, roboty budowlane "
        "oraz zakup i instalację tomografu komputerowego na potrzeby Laboratorium AI w Diagnostyce Obrazowej.",
        "Single design-and-build lump sum bundling architectural design, construction works, and supply/installation "
        "of a CT scanner for the AI Diagnostic Imaging Laboratory.",
    ),
    "2026/BZP 00103167": (
        "Unieważnione wcześniejsze postępowanie w formule „zaprojektuj i wybuduj” łączące roboty budowlane "
        "i dostawę tomografu komputerowego dla Laboratorium AI w Diagnostyce Obrazowej.",
        "Earlier cancelled design-and-build tender bundling construction works and CT scanner delivery "
        "for the AI Diagnostic Imaging Laboratory.",
    ),
    "2026/BZP 00164948": (
        "Postępowanie w formule „zaprojektuj i wybuduj” łączące budowę hybrydowych źródeł OZE "
        "z inteligentnym systemem zarządzania energią wspomaganym AI.",
        "Design-and-build tender combining construction of hybrid renewable energy (RES) installations "
        "with an AI-assisted energy management system.",
    ),
    "2025/BZP 00543355": (
        "Wspólny kontrakt (CPV 79710000-4) obejmuje 37-miesięczną fizyczną ochronę obiektów instytutu "
        "oraz dostawę i konfigurację systemu kontroli dostępu wspomaganego AI.",
        "Combined contract (CPV 79710000-4) covering 37 months of physical security guard services across "
        "institute facilities alongside AI-assisted access control hardware and software.",
    ),
    "2026/BZP 00124082": (
        "6-częściowy pakiet KPO łączący wdrożenia AI (dokumentacja medyczna: 490,8 tys. zł, wirtualna rejestratorka: "
        "165,0 tys. zł, Serwer AI: 471,3 tys. zł) z ogólnymi szkoleniami IT dla administratorów (136,9 tys. zł), chmurą (8,0 tys. zł) i monitorami (3,3 tys. zł).",
        "6-lot KPO hospital package combining dedicated AI deployments (medical documentation AI: 490.8k PLN, virtual receptionist: "
        "165.0k PLN, AI server: 471.3k PLN) with general IT admin trainings (136.9k PLN), cloud (8.0k PLN), and monitors (3.3k PLN).",
    ),
    "2026/BZP 00183188": (
        "Jeden ryczałt obejmuje rozbudowę szpitalnego systemu obrazowania PACS/RIS, integrację z P1 i PUI, "
        "zakup narzędzi AI optymalizujących pracę personelu oraz szkolenia.",
        "Single lump sum bundling hospital PACS/RIS imaging system expansion, P1/PUI national platform integration, "
        "AI workflow tools, and staff training.",
    ),
    "2026/BZP 00177212": (
        "Wspólny ryczałt na wdrożenie ogólnego systemu elektronicznego obiegu dokumentów i oprogramowania "
        "do zarządzania majątkiem (ERP/EZD) ze wsparciem modułów AI.",
        "Single lump sum for an enterprise document-workflow (EZD) and asset-management software suite "
        "with embedded AI support.",
    ),
    "2026/BZP 00379906": (
        "Wspólny ryczałt na wdrożenie powiatowego Systemu Zarządzania Zadaniami i portalu Intranet "
        "wraz z chatbotem opartym na architekturze RAG oraz szkoleniami.",
        "Single lump sum combining a county Task Management System and Intranet portal with a RAG chatbot "
        "and staff training.",
    ),
    "2025/BZP 00136813": (
        "Zakup badawczego mikroskopu fluorescencyjnego do automatycznego skanowania preparatów (CPV 38515200-0) "
        "wraz z oprogramowaniem analizy obrazu wspomaganym algorytmami AI.",
        "Purchase of a research slide-scanning fluorescence microscope (CPV 38515200-0) bundled with "
        "AI-assisted image analysis software.",
    ),
    "2025/BZP 00165927": (
        "Dostawa klinicznego aparatu USG z 4 głowicami i funkcją Dopplera (CPV 33124120-2) "
        "wyposażonego we wbudowane funkcje analityczne AI.",
        "Supply of a clinical 4-probe Doppler ultrasound scanner (CPV 33124120-2) equipped with "
        "built-in AI diagnostic support.",
    ),
    "2026/BZP 00488618": (
        "Zakup szpitalnego aparatu USG z 3 głowicami na potrzeby SOR (CPV 33112200-0) "
        "wraz z wbudowanym oprogramowaniem wspierającym diagnostykę AI.",
        "Purchase of a 3-probe emergency-department ultrasound scanner (CPV 33112200-0) with "
        "embedded AI diagnostic software.",
    ),
    "2025/BZP 00462052": (
        "3-częściowy zakup studyjno-scenicznego sprzętu elektroakustycznego: systemu odsłuchu (129,9 tys. zł), "
        "systemu przetwarzania dźwięku z AI (119,0 tys. zł) oraz przetworników A/C i C/A (129,8 tys. zł).",
        "3-lot stage and studio audio hardware purchase: monitoring speakers (129.9k PLN), AI sound-processing "
        "system (119.0k PLN), and A/D–D/A converters (129.8k PLN).",
    ),
    "2025/BZP 00398324": (
        "Unieważniona edycja 3-częściowego przetargu na system odsłuchu, przetwarzania dźwięku z AI "
        "oraz przetworniki elektroakustyczne A/C i C/A.",
        "Cancelled edition of the 3-lot tender for audio monitoring gear, AI sound processing, "
        "and A/D–D/A converters.",
    ),
    "2025/BZP 00387604": (
        "Pierwsza unieważniona edycja 3-częściowego przetargu na system odsłuchu, przetwarzania dźwięku z AI "
        "oraz przetworniki elektroakustyczne A/C i C/A.",
        "First cancelled edition of the 3-lot tender for audio monitoring gear, AI sound processing, "
        "and A/D–D/A converters.",
    ),
    "2026/BZP 00395505": (
        "Wspólny ryczałt na dostawę i konfigurację sprzętu oraz oprogramowania dla połączonego "
        "Laboratorium Technologii Immersyjnych (VR/AR) i Sztucznej Inteligencji.",
        "Single lump sum for hardware and software equipping a combined Immersive Technologies (VR/AR) "
        "and Artificial Intelligence Laboratory.",
    ),
    "2026/BZP 00488515": (
        "5-częściowe postępowanie obejmujące 1 część dla laboratorium AI oraz 4 części wyposażenia "
        "laboratorium i produkcji immersyjnej (VR/AV).",
        "5-lot tender combining 1 AI laboratory lot with 4 immersive-production (VR/AV) laboratory lots.",
    ),
    "2026/BZP 00454813": (
        "7-częściowe postępowanie obejmujące 2 części dla laboratorium AI (Cz. 1 i 6) oraz 5 części "
        "wyposażenia laboratorium immersyjnego i mieszanej rzeczywistości.",
        "7-lot tender combining 2 AI laboratory lots (Lots 1 & 6) with 5 immersive and mixed-reality laboratory lots.",
    ),
    "2026/BZP 00213280": (
        "Wydzielono Część 1 (audyt końcowy inwestycji D1.1.2 KPO obejmującej cyfryzację szpitala, cyberbezpieczeństwo i AI: "
        "32 668,80 zł); wyłączono czysto nie-AI Części 3–4 (SZBI i e-learning cyber: 56 369,14 zł).",
        "Isolated Lot 1 (final audit of the KPO D1.1.2 hospital digitalization, cybersecurity & AI investment: "
        "32,668.80 PLN); excluded pure non-AI Lots 3–4 (ISMS & cybersecurity e-learning: 56,369.14 PLN).",
    ),
    "2026/BZP 00264855": (
        "Wspólny ryczałt za łączny audyt bezpieczeństwa informacji, ciągłości działania (BCMS), "
        "systemów sztucznej inteligencji (AI) oraz dostępności cyfrowej (WCAG 2.1).",
        "Single lump sum covering a combined audit of information security, business continuity (BCMS), "
        "AI systems, and WCAG 2.1 digital accessibility.",
    ),
    "2026/BZP 00232174": (
        "Unieważniona wcześniejsza edycja łącznego audytu bezpieczeństwa informacji, ciągłości działania (BCMS), "
        "systemów AI oraz dostępności cyfrowej (WCAG 2.1).",
        "Earlier cancelled edition of the combined information security, BCMS, AI systems, "
        "and WCAG 2.1 digital accessibility audit.",
    ),
}

# Explicit canonical contractor normalization map (after stripping addresses/NIP/REGON)
CONTRACTOR_CANONICAL_MAP: dict[str, str] = {
    '"restor" - p.anton, a.czapski, t.rostropowicz spółka jawna': (
        '"RESTOR" P. Anton, A. Czapski, T. Rostropowicz Sp. j.'
    ),
    "4cf sp. z o. o.": "4CF Sp. z o.o.",
    "4cf sp. z o.o.": "4CF Sp. z o.o.",
    "akademia dla biznesu sp. z o.o.": "Akademia Dla Biznesu Sp. z o.o.",
    "akademia kształcenia zawodowego spółka z o.o.": "Akademia Kształcenia Zawodowego Sp. z o.o.",
    "coraz zdrowiej sp. z o.o.": "Coraz Zdrowiej Sp. z o.o.",
    "dwór mościbrody sp. z o. o., ul.": "Dwór Mościbrody Sp. z o.o.",
    "dwór mościbrody sp. z o.o.": "Dwór Mościbrody Sp. z o.o.",
    "e4i sp. z o.o.": "E4I Sp. z o.o.",
    "ems - euromed medical solution sp. z o.o.": "EMS - Euromed Medical Solution Sp. z o.o.",
    "eu -consult sp. z o.o.": "EU-CONSULT Sp. z o.o.",
    "gigaserwer spółka z ograniczoną odpowiedzialnością": "Gigaserwer Sp. z o.o.",
    "gigaserwer sp. z o.o.": "Gigaserwer Sp. z o.o.",
    "grupa szymbud sp. z.o.o. sp. j.": "Grupa Szymbud Sp. z o.o. Sp. j.",
    "imks sp. z o.o. sp. k.": "IMKS Sp. z o.o. Sp. k.",
    "innergo systems spółka z o.o.": "INNERGO Systems Sp. z o.o.",
    "instytut innowacyjnej edukacji sp. z o. o.": "Instytut Innowacyjnej Edukacji Sp. z o.o.",
    "instytut innowacyjnej edukacji sp. z o.o.": "Instytut Innowacyjnej Edukacji Sp. z o.o.",
    "intersieć andrzej szandała": "INTERSIEĆ Andrzej Szandała",
    "invest it sp. z o. o.": "Invest IT Sp. z o.o.",
    "it-dev sp. z o.o.": "IT-Dev Sp. z o.o.",
    "itrust spółka z ograniczoną odpowiedzialnością": "ITRUST Sp. z o.o.",
    "krajowy operator chmury medycznej sp. z o. o.": "Krajowy Operator Chmury Medycznej Sp. z o.o.",
    "krajowy operator chmury medycznej sp. z o.o.": "Krajowy Operator Chmury Medycznej Sp. z o.o.",
    "maxto its spółka z ograniczoną odpowiedzialnością": "MAXTO ITS Sp. z o.o.",
    "medalion technology p.s.a.": "Medalion Technology P.S.A.",
    "medix sławomir szwed sp. komandytowa": "Medix Sławomir Szwed Sp. k.",
    "miro prosta spółka akcyjna": "MIRO P.S.A.",
    "moje bambino sp. z o.o.": "Moje Bambino Sp. z o.o.",
    "mw consulting spółka z o. o.": "MW Consulting Sp. z o.o.",
    "mw consulting sp. z o.o.": "MW Consulting Sp. z o.o.",
    "najlepsza spółka sp. z o.o.": "Najlepsza Spółka Sp. z o.o.",
    "net-o-logy sp. z o .o.": "net-o-logy Sp. z o.o.",
    "net-o-logy sp. z o.o.": "net-o-logy Sp. z o.o.",
    "new life property sp. z o.o.": "New Life Property Sp. z o.o.",
    "newind spółka akcyjna (newind)": "NEWIND S.A.",
    "no input signal sp. z o.o.": "No Input Signal Sp. z o.o.",
    "nobleprog polska sp. z o.o.": "NobleProg Polska Sp. z o.o.",
    "nova system group sp. z o.o": "NOVA SYSTEM GROUP Sp. z o.o.",
    "oprogramowanie naukowo-techniczne sp.z.o.o.": "Oprogramowanie Naukowo-Techniczne Sp. z o.o.",
    "orange polska sa": "Orange Polska S.A.",
    "pc open sp. z o.o.": "PC Open Sp. z o.o.",
    "pharmdiver spółka z ograniczoną odpowiedzialnością": "Pharmdiver Sp. z o.o.",
    "pharmdiver sp. z o.o.": "Pharmdiver Sp. z o.o.",
    "polsound sp. z o.o.": "Polsound Sp. z o.o.",
    "precoptic co wojciechowscy sp. jawna": "Precoptic Co. Wojciechowscy Sp. j.",
    "progress systemy komputerowe sp.zo.o": "Progress Systemy Komputerowe Sp. z o.o.",
    "progress systemy komputerowe sp. z o.o.": "Progress Systemy Komputerowe Sp. z o.o.",
    "przedsiębiorstwo produkcyjno-usługowe micro m. kowalski, z. kowalska spółka cywilna": (
        "PPU Micro M. Kowalski, Z. Kowalska s.c."
    ),
    'przedsiębiorstwo wielobranżowe "gran" antoni kujawa': (
        'Przedsiębiorstwo Wielobranżowe "GRAN" Antoni Kujawa'
    ),
    "przedsiębiorstwo wielobranżowe „gran” antoni kujawa": (
        "Przedsiębiorstwo Wielobranżowe „GRAN” Antoni Kujawa"
    ),
    "sages sp. z o.o.": "Sages Sp. z o.o.",
    "scharmach consulting paweł scharmach": "SCHARMACH CONSULTING Paweł Scharmach",
    "siemens healthcare sp. z o.o.": "Siemens Healthcare Sp. z o.o.",
    "stinet sp. z o.o.": "Stinet Sp. z o.o.",
    "uknow edu sp. z o.o.": "UKNOW EDU Sp. z o.o.",
    "uphotel sp. z o.o.": "UpHOTEL Sp. z o.o.",
    "upmedic sp. z o.o.": "upmedic Sp. z o.o.",
    "vitronic eastern europe sp. z o.o.": "VITRONIC Eastern Europe Sp. z o.o.",
    "wise people sp. z o.o.": "WISE PEOPLE Sp. z o.o.",
    "xcomp sp. z o.o. sp. k.": "Xcomp Sp. z o.o. Sp. k.",
    "zespół ekspertów manager pelczar sp. j.": "Zespół Ekspertów Manager Pelczar Sp. j.",
    "zoneo oleksiewicz spółka koandytowo-akcyjna": "Zoneo Oleksiewicz S.K.A.",
    "zoneo oleksiewicz s.k.a.": "Zoneo Oleksiewicz S.K.A.",
}


def clean_ws(value: str | None) -> str | None:
    """Normalize NBSP, CR/LF, tabs, and repeated spaces into clean single-space text."""
    if value is None:
        return None
    s = value.replace("\xa0", " ").replace("\r", " ").replace("\n", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def normalize_org(org: str) -> str:
    s = clean_ws(org) or ""
    # Fix clerical typos in official BZP buyer headers without altering official entity names
    s = s.replace("z POlikliniką", "z Polikliniką").replace(" mi. św. ", " im. św. ")
    # Strip trailing period on institution names when not an abbreviation like 'Sp. z o.o.' or 'S.A.'
    if s.endswith(".") and not re.search(r"(?:Sp\. z o\.o\.|S\.A\.|s\.c\.|Sp\. j\.|Sp\. k\.|im\.|ul\.)$", s, re.I):
        s = s[:-1].strip()
    return s


def normalize_cpv(cpv: str) -> str:
    s = clean_ws(cpv) or ""
    if s in CPV_COMPLETIONS:
        return CPV_COMPLETIONS[s]
    # Also match prefix if any whitespace differed
    for prefix, full in CPV_COMPLETIONS.items():
        if s.startswith(prefix) and not s.endswith(")"):
            return full
    return s


def normalize_contractor(raw_name: str) -> str:
    s = clean_ws(raw_name) or ""
    # Strip glued street/postal/NIP/REGON suffixes from BZP free-text fields
    s = re.sub(r"\s+Adres:\s.*$", "", s, flags=re.I)
    s = re.sub(r",?\s+ul\.\s.*$", "", s, flags=re.I)
    s = re.sub(r",\s+ul\.$", "", s, flags=re.I)
    s = re.sub(r",\s+[A-ZĄĆĘŁŃÓŚŹŻ][\wąćęłńóśźż.\-\s]+\d+[A-Za-z0-9/\-]*,\s*\d{2}-\d{3}\s+.*$", "", s)
    s = re.sub(r"\s+NIP[:\s]+\d+.*$", "", s, flags=re.I)
    s = s.strip(" ,;")

    low = s.lower()
    if low in CONTRACTOR_CANONICAL_MAP:
        return CONTRACTOR_CANONICAL_MAP[low]

    # Generic fallback legal-form cleanup
    s = re.sub(r"\bspółka z ograniczoną odpowiedzialnością\b", "Sp. z o.o.", s, flags=re.I)
    s = re.sub(r"\bspółka\s+z\s+o\.\s*o\.?", "Sp. z o.o.", s, flags=re.I)
    s = re.sub(r"\bsp\.\s*z\s*o\.\s*o\.?", "Sp. z o.o.", s, flags=re.I)
    s = re.sub(r"\bprosta spółka akcyjna\b", "P.S.A.", s, flags=re.I)
    low2 = (clean_ws(s) or s).lower()
    if low2 in CONTRACTOR_CANONICAL_MAP:
        return CONTRACTOR_CANONICAL_MAP[low2]
    return clean_ws(s) or s


def strip_html_lines(html_body: str) -> list[str]:
    text = re.sub(r"<(br|p|div|li|tr|h\d)[^>]*>", "\n", html_body or "", flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = unescape(text).replace("\xa0", " ")
    return [re.sub(r"[ \t]+", " ", ln).strip() for ln in text.splitlines() if ln.strip()]


class BzpCacheAndClient:
    """Reads cached BZP API JSON payloads and falls back to live BZP API requests when needed."""

    def __init__(self, cache_dir: Path | None, allow_live: bool = True) -> None:
        self.cache_dir = cache_dir
        self.allow_live = allow_live
        self.by_bzp: dict[str, dict[str, Any]] = {}
        self.by_id: dict[str, dict[str, Any]] = {}
        self.by_tender: dict[str, list[dict[str, Any]]] = {}
        self._last_req_ts = 0.0
        if cache_dir and cache_dir.exists():
            self._load_cache_dir(cache_dir)

    def _register_item(self, item: dict[str, Any]) -> None:
        if not isinstance(item, dict) or "bzpNumber" not in item:
            return
        bzp = item["bzpNumber"]
        oid = item.get("objectId")
        tid = item.get("tenderId")
        has_html = bool(item.get("htmlBody"))
        if bzp not in self.by_bzp or (has_html and not self.by_bzp[bzp].get("htmlBody")):
            self.by_bzp[bzp] = item
        if oid and (oid not in self.by_id or (has_html and not self.by_id[oid].get("htmlBody"))):
            self.by_id[oid] = item
        if tid:
            existing = self.by_tender.setdefault(tid, [])
            for idx, prev in enumerate(existing):
                if prev.get("objectId") == oid and oid is not None:
                    if has_html and not prev.get("htmlBody"):
                        existing[idx] = item
                    break
            else:
                existing.append(item)

    def _load_cache_dir(self, cache_dir: Path) -> None:
        for path in sorted(cache_dir.glob("*.json")):
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if isinstance(data, list):
                for it in data:
                    self._register_item(it)
            elif isinstance(data, dict):
                if "bzpNumber" in data:
                    self._register_item(data)
                for val in data.values():
                    if isinstance(val, list):
                        for it in val:
                            self._register_item(it)
                    elif isinstance(val, dict) and "bzpNumber" in val:
                        self._register_item(val)

    def _api_get(self, params: dict[str, Any]) -> list[dict[str, Any]]:
        if not self.allow_live:
            return []
        elapsed = time.time() - self._last_req_ts
        if elapsed < POLITE_DELAY_SEC:
            time.sleep(POLITE_DELAY_SEC - elapsed)

        qs = urllib.parse.urlencode(params)
        url = f"{BZP_API_BASE}?{qs}"
        headers = {
            "Accept": "application/json",
            "User-Agent": "RolePlayingTech-BZP-Audit/1.0 (+https://roleplaying.tech)",
        }
        for attempt in range(1, 5):
            req = urllib.request.Request(url, headers=headers)
            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    payload = json.loads(resp.read().decode("utf-8"))
                self._last_req_ts = time.time()
                items = payload if isinstance(payload, list) else []
                for it in items:
                    self._register_item(it)
                return items
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
                if attempt == 4:
                    raise RuntimeError(f"BZP API request failed after 4 attempts ({url}): {exc}") from exc
                time.sleep(8.0 * attempt)
        return []

    def fetch_windowed(
        self,
        notice_type: str,
        date_from: str,
        date_to: str,
        extra_params: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """Query BZP API with automatic recursive date-range splitting if PageSize=500 saturates."""
        params = {
            "NoticeType": notice_type,
            "PublicationDateFrom": f"{date_from}T00:00:00",
            "PublicationDateTo": f"{date_to}T23:59:59",
            "PageSize": PAGE_SIZE,
            **extra_params,
        }
        batch = self._api_get(params)
        if len(batch) < PAGE_SIZE or date_from >= date_to:
            return batch
        d0 = datetime.strptime(date_from, "%Y-%m-%d").date()
        d1 = datetime.strptime(date_to, "%Y-%m-%d").date()
        mid = d0 + timedelta(days=(d1 - d0).days // 2)
        left = self.fetch_windowed(notice_type, d0.isoformat(), mid.isoformat(), extra_params)
        right = self.fetch_windowed(
            notice_type, (mid + timedelta(days=1)).isoformat(), d1.isoformat(), extra_params
        )
        return left + right

    def get_notice_for_record(self, rec: dict[str, Any]) -> dict[str, Any] | None:
        item = self.by_id.get(rec["id"]) or self.by_bzp.get(rec["bzp"])
        if item and item.get("htmlBody"):
            return item
        if not self.allow_live:
            return item
        d0 = (datetime.strptime(rec["date"], "%Y-%m-%d").date() - timedelta(days=3)).isoformat()
        d1 = (datetime.strptime(rec["date"], "%Y-%m-%d").date() + timedelta(days=3)).isoformat()
        for ntype in ("ContractNotice", "TenderResultNotice"):
            self.fetch_windowed(ntype, d0, d1, {"NoticeNumber": rec["bzp"]})
            item = self.by_id.get(rec["id"]) or self.by_bzp.get(rec["bzp"])
            if item and item.get("htmlBody"):
                return item
        return item

    def find_tender_notices(
        self, base_notice: dict[str, Any], pub_date: str
    ) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        """Return (result_notices, update_notices) matching `base_notice['tenderId']` up to SNAPSHOT_DATE."""
        tid = base_notice.get("tenderId")
        if not tid:
            return [], []
        cached = self.by_tender.get(tid, [])
        # If live mode is enabled and no cached result exists yet, query by OrganizationName fragment
        if self.allow_live and not any(x.get("noticeType") == "TenderResultNotice" for x in cached):
            org_raw = base_notice.get("organizationName") or ""
            org_frag = clean_ws(org_raw.split("-")[0])[:45] if org_raw else ""
            if org_frag:
                self.fetch_windowed(
                    "TenderResultNotice", pub_date, SNAPSHOT_DATE, {"OrganizationName": org_frag}
                )
                self.fetch_windowed(
                    "NoticeUpdateNotice", pub_date, SNAPSHOT_DATE, {"OrganizationName": org_frag}
                )
                cached = self.by_tender.get(tid, [])

        results = [
            x
            for x in cached
            if x.get("noticeType") == "TenderResultNotice"
            and (x.get("publicationDate") or "")[:10] <= SNAPSHOT_DATE
            and x.get("htmlBody")
        ]
        updates = [
            x
            for x in cached
            if x.get("noticeType") == "NoticeUpdateNotice"
            and (x.get("publicationDate") or "")[:10] <= SNAPSHOT_DATE
            and x.get("htmlBody")
        ]
        results.sort(key=lambda x: x.get("publicationDate") or "")
        updates.sort(key=lambda x: x.get("publicationDate") or "")
        return results, updates


def parse_eu_flag(notice: dict[str, Any]) -> bool | None:
    html_body = notice.get("htmlBody") or ""
    flat = clean_ws(re.sub(r"<[^>]+>", " ", unescape(html_body))) or ""
    if notice.get("noticeType") == "TenderResultNotice":
        m = re.search(
            r"2\.11\.\)\s*Czy zamówienie albo umowa ramowa dotyczy projektu lub programu "
            r"współfinansowanego ze środków Unii Europejskiej:\s*(Tak|Nie)\b",
            flat,
        )
    else:
        m = re.search(
            r"2\.14\.\)\s*Czy zamówienie albo umowa ramowa dotyczy projektu lub programu "
            r"współfinansowanego ze środków Unii Europejskiej:\s*(Tak|Nie)\b",
            flat,
        )
    if not m:
        return None
    return m.group(1) == "Tak"


def parse_result_notice(notice: dict[str, Any]) -> dict[str, Any]:
    """Parse outcome, amounts, bids, contract dates, and contractors from a TenderResultNotice."""
    lines = strip_html_lines(notice.get("htmlBody") or "")
    text = "\n".join(lines)

    outcomes = re.findall(
        r"5\.1\.\)\s*Postępowanie zakończyło się zawarciem umowy albo unieważnieniem postępowania:\s*([^\n]+)",
        text,
    )
    has_award = any("zawarciem umowy" in o.lower() for o in outcomes)
    status = "resolved" if has_award else "cancelled"

    bids_all = [
        int(x)
        for x in re.findall(r"6\.1\.\)\s*Liczba otrzymanych ofert lub wniosków:\s*(\d+)", text)
    ]

    def extract_pln(prefix: str) -> list[float]:
        vals: list[float] = []
        for m in re.finditer(rf"{re.escape(prefix)}[^\n:]*:\s*([\d\s]+(?:,\d{{1,4}})?)\s*PLN\b", text):
            vals.append(float(re.sub(r"\s+", "", m.group(1)).replace(",", ".")))
        return vals

    vals_64 = extract_pln("6.4.)")
    vals_82 = extract_pln("8.2.)")
    dates_81 = re.findall(r"8\.1\.\)\s*Data zawarcia umowy:\s*(\d{4}-\d{2}-\d{2})", text)

    raw_contractors = re.findall(
        r"7\.3\.1\)\s*Nazwa \(firma\) wykonawcy, któremu udzielono zamówienia[^:]*:\s*([^\n]+)",
        text,
    )
    contractors: list[str] = []
    for c in raw_contractors:
        nc = normalize_contractor(c)
        if nc and nc not in contractors:
            contractors.append(nc)

    amount_pln: float | None = None
    if status == "resolved":
        if vals_82:
            amount_pln = round(sum(vals_82), 2)
        elif vals_64:
            amount_pln = round(sum(vals_64), 2)

    return {
        "status": status,
        "amountPln": amount_pln,
        "bids": max(bids_all) if bids_all else None,
        "bidsPerLot": bids_all,
        "contractDate": max(dates_81) if dates_81 else None,
        "contractors": contractors,
        "eu": parse_eu_flag(notice),
    }


def parse_updated_deadline(updates: list[dict[str, Any]]) -> str | None:
    """Extract latest revised bid submission deadline (`8.1.) Termin składania ofert`) if present."""
    latest: str | None = None
    for upd in updates:
        flat = "\n".join(strip_html_lines(upd.get("htmlBody") or ""))
        for m in re.finditer(r"8\.1\.\)[^\n]*?(\d{4}-\d{2}-\d{2})", flat):
            latest = m.group(1)
        for m in re.finditer(r"Termin składania ofert[^\n]*?(\d{4}-\d{2}-\d{2})", flat):
            latest = m.group(1)
    return latest


def audit_records(raw_records: list[dict[str, Any]], client: BzpCacheAndClient) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    audited: list[dict[str, Any]] = []
    transitions: list[dict[str, Any]] = []
    amount_changes: list[dict[str, Any]] = []
    eu_flips: list[str] = []
    cpv_fixes: list[tuple[str, str, str]] = []

    for orig in raw_records:
        r = dict(orig)
        bzp = clean_ws(r["bzp"]) or r["bzp"]
        r["bzp"] = bzp

        base_notice = client.get_notice_for_record(r)

        # Preserve pre-existing contractNoticeUrl on re-runs (idempotency)
        contract_notice_url: str | None = r.get("contractNoticeUrl")
        result_bzp: str | None = r.get("resultBzp")

        # 1. Check `open_or_pending` proceedings for matching TenderResultNotice / NoticeUpdateNotice
        if r["status"] == "open_or_pending" and base_notice:
            res_notices, upd_notices = client.find_tender_notices(base_notice, r["date"])
            if res_notices:
                chosen = res_notices[-1]
                parsed = parse_result_notice(chosen)
                prev_status = r["status"]
                r["status"] = parsed["status"]
                r["amountPln"] = parsed["amountPln"]
                r["bids"] = parsed["bids"]
                r["contractDate"] = parsed["contractDate"]
                r["contractors"] = parsed["contractors"]
                if parsed["eu"] is not None:
                    if parsed["eu"] != orig.get("eu"):
                        eu_flips.append(bzp)
                    r["eu"] = parsed["eu"]
                result_bzp = chosen["bzpNumber"]
                if not contract_notice_url:
                    contract_notice_url = r["url"]
                r["url"] = f"{BZP_DETAILS_PREFIX}{chosen['objectId']}"
                transitions.append(
                    {
                        "bzp": bzp,
                        "resultBzp": result_bzp,
                        "fromStatus": prev_status,
                        "toStatus": r["status"],
                        "amountPln": r["amountPln"],
                        "bids": r["bids"],
                        "contractDate": r["contractDate"],
                        "contractors": list(r["contractors"]),
                    }
                )
            else:
                # Still open_or_pending: verify EU flag in section 2.14 and check NoticeUpdateNotice deadlines
                eu_val = parse_eu_flag(base_notice)
                if eu_val is not None and eu_val != r["eu"]:
                    eu_flips.append(bzp)
                    r["eu"] = eu_val
                rev_deadline = parse_updated_deadline(upd_notices)
                if rev_deadline and (not r.get("deadline") or rev_deadline > r["deadline"]):
                    r["deadline"] = rev_deadline
                result_bzp = None
                contract_notice_url = None
        else:
            # Already resolved or cancelled
            if r["status"] in ("resolved", "cancelled") and not result_bzp:
                result_bzp = bzp
            if base_notice:
                eu_val = parse_eu_flag(base_notice)
                if eu_val is not None and eu_val != r["eu"]:
                    eu_flips.append(bzp)
                    r["eu"] = eu_val
                if (
                    r["status"] == "resolved"
                    and base_notice.get("noticeType") == "TenderResultNotice"
                    and base_notice.get("htmlBody")
                    and bzp not in LOT_ISOLATION_OVERRIDES
                ):
                    parsed_existing = parse_result_notice(base_notice)
                    if parsed_existing["contractors"]:
                        r["contractors"] = parsed_existing["contractors"]

        # 2. Verify Centrum e-Zdrowia 2026/BZP 00009631 (`typoFixed: true`) exact TenderResultNotice URL
        if bzp == "2026/BZP 00009631":
            r["typoFixed"] = True
            r["amountPln"] = 544000.0
            r["url"] = f"{BZP_DETAILS_PREFIX}08de4ded-90a3-9604-d6d3-f5000169f1af"

        # 3. Apply category overrides where HTML OPZ + CPVs proved misclassification
        if bzp in CATEGORY_OVERRIDES:
            r["category"] = CATEGORY_OVERRIDES[bzp]

        # 4. Apply multi-lot AI isolation and section 8.2 clerical repetition fixes
        lots_info: dict[str, Any] | None = None
        scope_note_pl: str | None = None
        scope_note_en: str | None = None

        if bzp in LOT_ISOLATION_OVERRIDES:
            ov = LOT_ISOLATION_OVERRIDES[bzp]
            prev_amt = orig.get("amountPln")
            prev_bids = orig.get("bids")
            r["amountPln"] = ov["amountPln"]
            r["bids"] = ov["bids"]
            r["contractDate"] = ov["contractDate"]
            r["contractors"] = list(ov["contractors"])
            lots_info = dict(ov["lotsInfo"])
            scope_note_pl = ov["scopeNotePl"]
            scope_note_en = ov["scopeNoteEn"]
            amount_changes.append(
                {
                    "bzp": bzp,
                    "resultBzp": result_bzp,
                    "origStatus": orig.get("status"),
                    "origAmountPln": prev_amt,
                    "newAmountPln": r["amountPln"],
                    "fullProceedingAmountPln": lots_info["fullProceedingAmountPln"],
                    "origBids": prev_bids,
                    "newBids": r["bids"],
                }
            )
        elif bzp in OTHER_MULTILOT_INFO:
            lots_info = dict(OTHER_MULTILOT_INFO[bzp])

        # 5. Assign `aiScope` and mixed-scope notes consistently
        if r["category"] == "incidental":
            ai_scope = "incidental"
        elif bzp in MIXED_SCOPE_NOTES:
            ai_scope = "mixed"
            scope_note_pl, scope_note_en = MIXED_SCOPE_NOTES[bzp]
        else:
            ai_scope = "pure"

        # Administrative orphan note on PIE 2026/BZP 00317670 (duplicate title superseded 97 min later)
        if bzp == "2026/BZP 00317670" and not scope_note_pl:
            scope_note_pl = (
                "Ogłoszenie z omyłkowo powtórzonym tytułem badania AI (PZP.2.2026), zastąpione 97 min później "
                "nowym postępowaniem 2026/BZP 00318033 bez publikacji formalnego unieważnienia pierwotnego rekordu."
            )
            scope_note_en = (
                "Notice published with an accidentally duplicated AI study title (from PZP.2.2026), superseded 97 minutes "
                "later by a fresh proceeding (2026/BZP 00318033) without a formal cancellation notice on this record."
            )

        # 6. Assign `subStatus` strictly against SNAPSHOT_DATE (2026-11-03)
        if r["status"] == "open_or_pending":
            deadline = r.get("deadline")
            sub_status = "open_for_bids" if (deadline and deadline >= SNAPSHOT_DATE) else "pending_result"
        else:
            sub_status = None

        # 7. String hygiene: CPV completion, whitespace cleanup, contractor normalization & deduplication
        old_cpv = r["cpv"]
        new_cpv = normalize_cpv(old_cpv)
        if old_cpv != new_cpv and not (clean_ws(old_cpv) or "").endswith(")"):
            cpv_fixes.append((bzp, old_cpv, new_cpv))

        norm_contractors: list[str] = []
        for c in r.get("contractors") or []:
            nc = normalize_contractor(c)
            if nc and nc not in norm_contractors:
                norm_contractors.append(nc)

        clean_rec = {
            "id": r["id"],
            "bzp": bzp,
            "resultBzp": result_bzp,
            "status": r["status"],
            "subStatus": sub_status,
            "date": r["date"],
            "deadline": r.get("deadline"),
            "contractDate": r.get("contractDate"),
            "year": int(r["year"]),
            "title": clean_ws(r["title"]) or "",
            "org": normalize_org(r["org"]),
            "city": clean_ws(r["city"]) or "",
            "province": clean_ws(r["province"]) or "",
            "sector": clean_ws(r["sector"]) or "",
            "category": r["category"],
            "aiScope": ai_scope,
            "scopeNotePl": clean_ws(scope_note_pl),
            "scopeNoteEn": clean_ws(scope_note_en),
            "cpv": new_cpv,
            "amountPln": round(float(r["amountPln"]), 2) if r.get("amountPln") is not None else None,
            "bids": int(r["bids"]) if r.get("bids") is not None else None,
            "lotsInfo": lots_info,
            "contractors": norm_contractors,
            "eu": bool(r["eu"]),
            "typoFixed": bool(r.get("typoFixed", False)),
            "url": r["url"],
            "contractNoticeUrl": contract_notice_url,
        }
        audited.append(clean_rec)

    summary = build_kpi_summary(audited, transitions, amount_changes, eu_flips, cpv_fixes)
    return audited, summary


def validate_records(records: list[dict[str, Any]]) -> None:
    assert isinstance(records, list), "Root JSON must be a list"
    assert len(records) == 171, f"Expected 171 records, got {len(records)}"

    expected_keys = {
        "id",
        "bzp",
        "resultBzp",
        "status",
        "subStatus",
        "date",
        "deadline",
        "contractDate",
        "year",
        "title",
        "org",
        "city",
        "province",
        "sector",
        "category",
        "aiScope",
        "scopeNotePl",
        "scopeNoteEn",
        "cpv",
        "amountPln",
        "bids",
        "lotsInfo",
        "contractors",
        "eu",
        "typoFixed",
        "url",
        "contractNoticeUrl",
    }

    seen_ids: set[str] = set()
    all_contractors: set[str] = set()
    typo_count = 0
    for i, r in enumerate(records):
        assert set(r.keys()) == expected_keys, f"Record #{i} ({r.get('bzp')}) key mismatch"
        assert r["id"] not in seen_ids, f"Duplicate id {r['id']}"
        seen_ids.add(r["id"])

        assert r["status"] in {"resolved", "open_or_pending", "cancelled"}
        if r["status"] == "open_or_pending":
            assert r["subStatus"] in {"open_for_bids", "pending_result"}
            assert r["amountPln"] is None
            assert r["resultBzp"] is None
        else:
            assert r["subStatus"] is None
            assert isinstance(r["resultBzp"], str) and "/BZP " in r["resultBzp"]

        if r["status"] == "resolved":
            assert isinstance(r["amountPln"], (int, float)) and r["amountPln"] > 0
            assert isinstance(r["contractDate"], str) and re.match(r"^\d{4}-\d{2}-\d{2}$", r["contractDate"])

        assert r["category"] in {"software_deploy", "hardware_lab", "training", "consulting", "incidental"}
        assert r["aiScope"] in {"pure", "mixed", "incidental"}
        if r["category"] == "incidental":
            assert r["aiScope"] == "incidental"
        else:
            assert r["aiScope"] in {"pure", "mixed"}

        if r["aiScope"] == "mixed":
            assert r["scopeNotePl"] and r["scopeNoteEn"], f"Missing scopeNote on mixed record {r['bzp']}"

        assert isinstance(r["cpv"], str) and r["cpv"].endswith(")"), f"Invalid/truncated CPV on {r['bzp']}: {r['cpv']}"
        for field in ("title", "org", "city", "province", "sector", "cpv"):
            val = r[field]
            assert "\n" not in val and "\r" not in val and "\xa0" not in val, f"Dirty ws in {field} on {r['bzp']}"
            assert "  " not in val, f"Double space in {field} on {r['bzp']}: {val!r}"

        for c in r["contractors"]:
            assert "\n" not in c and "  " not in c and "NIP" not in c and "REGON" not in c, f"Dirty contractor: {c!r}"
            assert not re.search(r"\bul\.\b", c, re.I), f"Street left in contractor: {c!r}"
            all_contractors.add(c)

        if r["lotsInfo"] is not None:
            li = r["lotsInfo"]
            assert {"totalLots", "aiLots", "bidsNotePl", "bidsNoteEn", "fullProceedingAmountPln"} == set(li.keys())
            assert isinstance(li["totalLots"], int) and li["totalLots"] >= 2

        if r["typoFixed"]:
            typo_count += 1
            assert r["bzp"] == "2026/BZP 00009631"

        assert r["url"].startswith(BZP_DETAILS_PREFIX), f"Invalid URL on {r['bzp']}: {r['url']}"

    assert typo_count == 1, f"Expected exactly 1 typoFixed record, got {typo_count}"
    lower_map: dict[str, str] = {}
    for c in sorted(all_contractors):
        low = c.lower()
        assert low not in lower_map, f"Case-duplicate contractor names: {lower_map[low]!r} vs {c!r}"
        lower_map[low] = c


def subset_kpis(rows: list[dict[str, Any]]) -> dict[str, Any]:
    resolved = [r for r in rows if r["status"] == "resolved" and r["amountPln"] is not None]
    open_rows = [r for r in rows if r["status"] == "open_or_pending"]
    cancelled = [r for r in rows if r["status"] == "cancelled"]
    amounts = [r["amountPln"] for r in resolved]
    with_bids = [r for r in resolved if r["bids"] is not None]
    single_bid = [r for r in with_bids if r["bids"] == 1]
    bids_vals = [r["bids"] for r in with_bids]
    eu_all = [r for r in rows if r["eu"]]
    eu_res = [r for r in resolved if r["eu"]]

    return {
        "proceedings": len(rows),
        "resolved": len(resolved),
        "open_or_pending": len(open_rows),
        "open_for_bids": sum(1 for r in open_rows if r["subStatus"] == "open_for_bids"),
        "pending_result": sum(1 for r in open_rows if r["subStatus"] == "pending_result"),
        "cancelled": len(cancelled),
        "sumPln": round(sum(amounts), 2),
        "medianPln": round(statistics.median(amounts), 2) if amounts else 0.0,
        "meanPln": round(statistics.mean(amounts), 2) if amounts else 0.0,
        "withBidsCount": len(with_bids),
        "singleBidCount": len(single_bid),
        "singleBidPct": round(100.0 * len(single_bid) / len(with_bids), 1) if with_bids else 0.0,
        "medianBids": round(statistics.median(bids_vals), 1) if bids_vals else None,
        "meanBids": round(statistics.mean(bids_vals), 2) if bids_vals else None,
        "euProceedings": len(eu_all),
        "euProceedingsPct": round(100.0 * len(eu_all) / len(rows), 1) if rows else 0.0,
        "euResolved": len(eu_res),
        "euSumPln": round(sum(r["amountPln"] for r in eu_res), 2),
    }


def build_kpi_summary(
    records: list[dict[str, Any]],
    transitions: list[dict[str, Any]],
    amount_changes: list[dict[str, Any]],
    eu_flips: list[str],
    cpv_fixes: list[tuple[str, str, str]],
) -> dict[str, Any]:
    core = [r for r in records if r["category"] != "incidental"]
    core_pure = [r for r in core if r["aiScope"] == "pure"]
    core_mixed = [r for r in core if r["aiScope"] == "mixed"]
    incidental = [r for r in records if r["category"] == "incidental"]

    by_category = {
        cat: subset_kpis([r for r in records if r["category"] == cat])
        for cat in ("software_deploy", "hardware_lab", "training", "consulting", "incidental")
    }
    by_category_pure = {
        cat: subset_kpis([r for r in core_pure if r["category"] == cat])
        for cat in ("software_deploy", "hardware_lab", "training", "consulting")
    }
    by_notice_year_core = {
        str(y): subset_kpis([r for r in core if r["year"] == y]) for y in (2024, 2025, 2026)
    }
    by_contract_year_core = {
        str(y): subset_kpis(
            [r for r in core if r["status"] == "resolved" and (r["contractDate"] or "").startswith(str(y))]
        )
        for y in (2023, 2024, 2025, 2026)
    }
    sectors = sorted({r["sector"] for r in core})
    by_sector_core = {s: subset_kpis([r for r in core if r["sector"] == s]) for s in sectors}

    provinces = sorted({r["province"] for r in core})
    by_province_core = {p: subset_kpis([r for r in core if r["province"] == p]) for p in provinces}

    # Top vendors across core resolved contracts
    vendor_stats: dict[str, dict[str, Any]] = {}
    for r in core:
        if r["status"] != "resolved" or r["amountPln"] is None:
            continue
        # For multi-contractor records where individual lot amounts differ, attribute proceeding count
        # and exact share / full record note transparently
        n_ctrs = len(r["contractors"])
        for c in r["contractors"]:
            st = vendor_stats.setdefault(c, {"contracts": 0, "sumPln": 0.0, "bzps": []})
            st["contracts"] += 1
            st["sumPln"] = round(st["sumPln"] + (r["amountPln"] / n_ctrs if n_ctrs > 1 else r["amountPln"]), 2)
            st["bzps"].append(r["bzp"])

    top_vendors_by_sum = sorted(
        [{"vendor": k, **v} for k, v in vendor_stats.items()],
        key=lambda x: (-x["sumPln"], -x["contracts"], x["vendor"]),
    )[:15]
    top_vendors_by_count = sorted(
        [{"vendor": k, **v} for k, v in vendor_stats.items()],
        key=lambda x: (-x["contracts"], -x["sumPln"], x["vendor"]),
    )[:15]

    top_contracts_core = [
        {
            "bzp": r["bzp"],
            "resultBzp": r["resultBzp"],
            "org": r["org"],
            "category": r["category"],
            "aiScope": r["aiScope"],
            "amountPln": r["amountPln"],
            "bids": r["bids"],
            "contractors": r["contractors"],
            "title": r["title"],
        }
        for r in sorted(
            [x for x in core if x["status"] == "resolved" and x["amountPln"] is not None],
            key=lambda x: -x["amountPln"],
        )[:15]
    ]

    return {
        "snapshotDate": SNAPSHOT_DATE,
        "all171": subset_kpis(records),
        "core159": subset_kpis(core),
        "corePure": subset_kpis(core_pure),
        "coreMixed": subset_kpis(core_mixed),
        "incidental12": subset_kpis(incidental),
        "byCategory": by_category,
        "byCategoryPure": by_category_pure,
        "byNoticeYearCore": by_notice_year_core,
        "byContractYearCore": by_contract_year_core,
        "bySectorCore": by_sector_core,
        "byProvinceCore": by_province_core,
        "topVendorsBySumCore": top_vendors_by_sum,
        "topVendorsByCountCore": top_vendors_by_count,
        "topContractsCore": top_contracts_core,
        "transitionsCount": len(transitions),
        "transitions": transitions,
        "amountChanges": amount_changes,
        "euFlipsCount": len(eu_flips),
        "euFlips": eu_flips,
        "cpvFixes": cpv_fixes,
    }


def write_json_atomic(target_path: Path, payload: Any) -> None:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = target_path.with_suffix(".tmp.json")
    serialized = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    with open(tmp_path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(serialized)
        fh.flush()
        os.fsync(fh.fileno())
    os.replace(tmp_path, target_path)


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    default_json = repo_root / "assets" / "lab" / "bzp-ai-2024-2026.json"

    parser = argparse.ArgumentParser(description="Audit and enrich BZP AI 2024-2026 dataset.")
    parser.add_argument("--input", type=Path, default=default_json, help="Input JSON path")
    parser.add_argument("--output", type=Path, default=default_json, help="Output JSON path (atomic write)")
    parser.add_argument("--cache-dir", type=Path, default=None, help="Optional directory with cached BZP API JSONs")
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Disable live BZP API fallback (use cached notices only)",
    )
    parser.add_argument("--report-json", type=Path, default=None, help="Optional path to write KPI & audit report JSON")
    args = parser.parse_args()

    raw_records = json.loads(args.input.read_text(encoding="utf-8"))
    if not isinstance(raw_records, list):
        raise ValueError("Input dataset must be a top-level JSON array of proceeding objects.")

    client = BzpCacheAndClient(cache_dir=args.cache_dir, allow_live=not args.offline)
    audited_records, summary = audit_records(raw_records, client)
    validate_records(audited_records)
    write_json_atomic(args.output, audited_records)

    if args.report_json:
        write_json_atomic(args.report_json, summary)

    c = summary["core159"]
    cp = summary["corePure"]
    cm = summary["coreMixed"]
    print(
        f"[OK] Wrote {len(audited_records)} records atomically to {args.output}\n"
        f"     Core (159): {c['resolved']} resolved ({c['sumPln']:,.2f} PLN, median {c['medianPln']:,.2f} PLN), "
        f"{c['open_or_pending']} open_or_pending ({c['open_for_bids']} open_for_bids, {c['pending_result']} pending_result), "
        f"{c['cancelled']} cancelled | single-bid: {c['singleBidCount']}/{c['withBidsCount']} ({c['singleBidPct']}%) | "
        f"EU: {c['euProceedings']}/159 ({c['euProceedingsPct']}%, {c['euSumPln']:,.2f} PLN)\n"
        f"     Pure core ({cp['proceedings']}): {cp['resolved']} resolved ({cp['sumPln']:,.2f} PLN, median {cp['medianPln']:,.2f} PLN) | "
        f"Mixed core ({cm['proceedings']}): {cm['resolved']} resolved ({cm['sumPln']:,.2f} PLN)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
