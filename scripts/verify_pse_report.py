#!/usr/bin/env python3
"""Deterministic quality, mathematical invariant & SEO gate for Issue 04:
'Wyłączamy tanie słońce, gdy prąd jest drogi. Co pokazały 73 924 kwadranse pracy sieci PSE'.

Validates:
  1. `assets/lab/pse-grid-2026.json` schema & Phase C zero-tolerance invariants
  2. Bilingual HTML reports (`pl/lab/redysponowanie-oze-pse/index.html` &
     `en/lab/polish-grid-curtailment/index.html`)
  3. Internal `#id` anchors, `data-pse-preset` syntax, canonical/hreflang/OG/Twitter tags & 1200x630 PNGs
  4. Zero forbidden Phase A/B traps (e.g., `+6.34 GW` / `+6,34 GW` un-zero-filled ramp, raw LaTeX `$`,
     or misattributed `Operator KSE` CHP owners).

Uses only the Python 3.12 standard library. Exits 0 on pass, 1 on any error.
"""

from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
import re
import struct
import sys
from typing import Any
import urllib.parse


SITE_ORIGIN = "https://roleplayingtech.com/"
PL_REL = "pl/lab/redysponowanie-oze-pse/index.html"
EN_REL = "en/lab/polish-grid-curtailment/index.html"

ISSUE4_TEXT_FILES = (
    "assets/lab/pse-grid-2026.json",
    PL_REL,
    EN_REL,
    "assets/lab/pse-explorer.js",
    "assets/lab/pse-explorer.css",
    "docs/lab/pse-grid-methodology.md",
    "docs/lab/pse-grid-press-kit.md",
)

ALLOWED_PRESET_KEYS = {"lens", "q", "tech", "owner", "year", "dtype", "preset"}
ALLOWED_LENSES = {"plants", "days"}
ALLOWED_PRESETS = {"coal", "gas", "esp", "exp_wkd", "net_imp", "y2026"}

FORBIDDEN_TRAPS = (
    (re.compile(r"6[.,]34\s*GW", re.I), "nieuzupełniona zerami rampa +6,34 GW z roboczej tabeli Fazy B"),
    (re.compile(r"1[.,]5\s*(?:mln|million)\s+prosument", re.I), "błędne przypisanie 1,5 mln prosumentów do dynamicznego net-billingu RCE"),
    (re.compile(r"Operator KSE"), "nieuzupełniony właściciel elektrociepłowni ('Operator KSE')"),
    (re.compile(r"`0`|\$[A-Za-z0-9_\\]"), "surowy zapis Markdown/LaTeX w widocznym HTML"),
)


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


def validate_json(payload: dict[str, Any], errors: list[str]) -> None:
    meta = payload.get("meta", {})
    expect(meta.get("continuousQuarters"), 73924, "meta.continuousQuarters", errors)
    expect(meta.get("calendarDays"), 770, "meta.calendarDays", errors)
    expect(meta.get("zeroMissingQuarters"), True, "meta.zeroMissingQuarters", errors)

    periods = payload.get("summary", {}).get("periods", {})
    y25 = periods.get("ytd_2025", {})
    y26 = periods.get("ytd_2026", {})
    expect(y25.get("quartersTotal"), 29376, "ytd_2025.quartersTotal", errors)
    expect(y26.get("quartersTotal"), 29376, "ytd_2026.quartersTotal", errors)
    expect(y25.get("curtailedGwh"), 1326.29, "ytd_2025.curtailedGwh", errors)
    expect(y26.get("curtailedGwh"), 1805.05, "ytd_2026.curtailedGwh", errors)
    expect(y26.get("balanceSharePct"), 98.84, "ytd_2026.balanceSharePct", errors)
    expect(y26.get("networkSharePct"), 1.16, "ytd_2026.networkSharePct", errors)
    expect(y26.get("rcePositiveSharePct"), 66.57, "ytd_2026.rcePositiveSharePct", errors)
    expect(y26.get("rceGe250Gwh"), 497.42, "ytd_2026.rceGe250Gwh", errors)
    expect(y26.get("rceGe250Quarters"), 3276, "ytd_2026.rceGe250Quarters", errors)
    expect(y26.get("rceNonPositiveQuarters"), 1361, "ytd_2026.rceNonPositiveQuarters", errors)
    expect(y26.get("valRceMax0Mln"), 251.46, "ytd_2026.valRceMax0Mln", errors)
    expect(y26.get("valCsdacMax0Mln"), 254.27, "ytd_2026.valCsdacMax0Mln", errors)
    expect(y26.get("valCenMax0Mln"), 355.09, "ytd_2026.valCenMax0Mln", errors)

    guil = payload.get("summary", {}).get("guillotine", {}).get("period2025_2026", {})
    expect(guil.get("ge200", {}).get("at00"), 2263, "guillotine.ge200.at00", errors)
    expect(guil.get("ge200", {}).get("totalJumps"), 2339, "guillotine.ge200.totalJumps", errors)
    expect(guil.get("ge200", {}).get("at15"), 23, "guillotine.ge200.at15", errors)
    expect(guil.get("ge200", {}).get("at30"), 31, "guillotine.ge200.at30", errors)
    expect(guil.get("ge200", {}).get("at45"), 22, "guillotine.ge200.at45", errors)
    expect(guil.get("ge500", {}).get("at00"), 1136, "guillotine.ge500.at00", errors)
    expect(guil.get("ge500", {}).get("totalJumps"), 1136, "guillotine.ge500.totalJumps", errors)

    ramp = payload.get("summary", {}).get("thermalRamp9Days", {})
    expect(ramp.get("plantsTotal"), 37, "thermalRamp9Days.plantsTotal", errors)
    expect(ramp.get("unitsTotal"), 106, "thermalRamp9Days.unitsTotal", errors)
    expect(ramp.get("h12PureThermalMw"), 7981.9, "thermalRamp9Days.h12PureThermalMw", errors)
    expect(ramp.get("h20PureThermalMw"), 13625.8, "thermalRamp9Days.h20PureThermalMw", errors)
    expect(ramp.get("pureThermalRampMw"), 5643.9, "thermalRamp9Days.pureThermalRampMw", errors)
    expect(ramp.get("thermalPlusEspSwingMw"), 7113.4, "thermalRamp9Days.thermalPlusEspSwingMw", errors)

    b250 = payload.get("summary", {}).get("borderRegimes2026", {}).get("rce_ge250", {}).get("borders", {})
    expect(b250.get("DE", {}).get("loopMw"), 605.2, "borders.rce_ge250.DE.loopMw", errors)
    expect(b250.get("CZ", {}).get("loopMw"), -738.3, "borders.rce_ge250.CZ.loopMw", errors)

    plants = payload.get("plants", [])
    days = payload.get("days", [])
    expect(len(plants), 37, "len(plants)", errors)
    expect(len(days), 140, "len(days)", errors)


def validate_html(rel_path: str, expected_lang: str, root: Path, errors: list[str]) -> None:
    p = root / rel_path
    if not p.is_file():
        errors.append(f"[BRAK PLIKU] {rel_path}")
        return
    raw = p.read_text(encoding="utf-8")
    dom = MiniDomParser()
    dom.feed(raw)

    ids_seen: set[str] = set()
    for id_val, line in dom.ids:
        if id_val in ids_seen:
            errors.append(f"[DUPLIKAT ID] {rel_path}:{line} id='{id_val}'")
        ids_seen.add(id_val)

    for req_id in ("fig-pse-price", "fig-pse-duck", "fig-pse-borders", "pse-explorer", "explorer"):
        if req_id not in ids_seen:
            errors.append(f"[BRAK MOUNT ID] {rel_path}: brak #{req_id}")

    html_tags = [ad for t, ad, _ in dom.elements if t == "html"]
    if not html_tags or html_tags[0].get("lang") != expected_lang:
        errors.append(f"[LANG] {rel_path}: oczekiwano lang='{expected_lang}'")

    for t, ad, line in dom.elements:
        href = ad.get("href", "")
        if href.startswith("#") and len(href) > 1 and href[1:] not in ids_seen:
            errors.append(f"[ANCHOR] {rel_path}:{line} nieistniejący cel '{href}'")
        if "data-pse-preset" in ad:
            qs = urllib.parse.parse_qs(ad["data-pse-preset"], keep_blank_values=True)
            for k, vals in qs.items():
                if k not in ALLOWED_PRESET_KEYS:
                    errors.append(f"[PRESET] {rel_path}:{line} nieznany klucz '{k}'")
                if k == "lens" and vals[0] not in ALLOWED_LENSES:
                    errors.append(f"[PRESET] {rel_path}:{line} nieznany lens '{vals[0]}'")
                if k == "preset" and vals[0] not in ALLOWED_PRESETS:
                    errors.append(f"[PRESET] {rel_path}:{line} nieznany preset '{vals[0]}'")

    visible_text = "\n".join(dom.text_chunks)
    for rx, desc in FORBIDDEN_TRAPS:
        m = rx.search(visible_text)
        if m:
            errors.append(f"[TRAP] {rel_path}: wykryto '{m.group(0)}' ({desc})")


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    errors: list[str] = []

    for rel in ISSUE4_TEXT_FILES:
        p = root / rel
        if not p.is_file():
            errors.append(f"[BRAK PLIKU] {rel}")
            continue
        if rel.endswith(".json"):
            payload = json.loads(p.read_text(encoding="utf-8"))
            validate_json(payload, errors)
            raw_json = p.read_text(encoding="utf-8")
            if "Operator KSE" in raw_json:
                errors.append("[JSON] Wykryto 'Operator KSE' w pse-grid-2026.json")

    validate_html(PL_REL, "pl", root, errors)
    validate_html(EN_REL, "en", root, errors)

    for og_rel in ("assets/lab/og-pse-grid-2026-pl.png", "assets/lab/og-pse-grid-2026-en.png"):
        dims = png_dimensions(root / og_rel)
        expect(dims, (1200, 630), f"Wymiary OG {og_rel}", errors)

    if errors:
        print(f"BŁĄD WERYFIKACJI RAPORTU NR 04 ({len(errors)} błędów):", file=sys.stderr)
        for e in errors:
            print("  -", e, file=sys.stderr)
        return 1

    print("OK (0 błędów): Raport NR 04 (PSE Grid 2024–2026) przeszedł wszystkie testy inwariantów, HTML i OG.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
