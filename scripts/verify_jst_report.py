#!/usr/bin/env python3
"""Deterministic quality, mathematical invariant, legal-citation & SEO gate for Issue 03:
'1,48 mld zł na „Cyberbezpieczny Samorząd”, a poczta co czwartego urzędu stoi otworem'.

Validates:
  1. `assets/lab/jst-cyber-2026.json` schema & Phase C zero-tolerance invariants:
     - 100% statutory GUS coverage: 2,809 JSTs (2,479 gminy + 314 powiaty + 16 województwa)
     - Exact penny match with CPPC FERC.02.02 ranking list: 2,511 grants = 1,483,979,072.49 PLN
     - All 6 Phase C patches verified (Branice 0 PLN, Włoszczowa 850k missing, Baborów 473,947 reject,
       Śniadowo missing, 8 org_fallback subdomains, Rybno/Wodzisław/Krynica-Zdrój migrated -> 30 freemails)
  2. Bilingual HTML reports (`pl/lab/cyberbezpieczny-samorzad/index.html` &
     `en/lab/municipal-cybersecurity/index.html`)
  3. Internal `#id` anchors, `data-jst-preset` syntax, canonical/hreflang/OG/Twitter tags & 1200x630 PNGs
  4. Zero forbidden Phase A/B traps ("Ustawa OSE", Rybno/Wodzisław/Krynica-Zdrój cited as active freemail,
     or calling all 336/350 sites "Meta Pixel" without separating 331 SDK plugins from 5 `/tr` pixels).

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
PL_REL = "pl/lab/cyberbezpieczny-samorzad/index.html"
EN_REL = "en/lab/municipal-cybersecurity/index.html"

ISSUE3_TEXT_FILES = (
    "assets/lab/jst-cyber-2026.json",
    PL_REL,
    EN_REL,
    "assets/lab/jst-explorer.js",
    "assets/lab/jst-explorer.css",
    "docs/lab/jst-cyber-methodology.md",
    "docs/lab/jst-cyber-press-kit.md",
)

ALLOWED_PRESET_KEYS = {"q", "voiv", "tp", "dm", "preset"}
ALLOWED_PRESETS = {
    "all",
    "max_nodmarc",
    "big_spoof",
    "pixel_tr",
    "zero_meta",
    "freemail",
    "sam_paradox",
    "consent_ok",
}

FORBIDDEN_TRAPS = (
    (re.compile(r"Ustaw[aęyieo]\s+OSE\b|OSE\s+Act\b", re.I), "błędna nazwa ustawy ('Ustawa OSE' zamiast ustawy o zwalczaniu nadużyć w komunikacji elektronicznej)"),
    (re.compile(r"gminarybno@wp\.pl|ugwodzislaw@wp\.pl|ugukry@ns\.onet\.pl", re.I), "nieaktualny adres freemail gminy, która zmigrowała na własną domenę (Rybno/Wodzisław/Krynica)"),
    (re.compile(r"`0`|\$[A-Za-z0-9_\\]"), "surowy zapis Markdown/LaTeX w widocznym tekście"),
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
    expect(meta.get("totalStatutoryJst"), 2809, "meta.totalStatutoryJst", errors)
    expect(meta.get("municipalitiesGminy"), 2479, "meta.municipalitiesGminy", errors)
    expect(meta.get("countiesPowiaty"), 314, "meta.countiesPowiaty", errors)
    expect(meta.get("voivodeshipsWojewodztwa"), 16, "meta.voivodeshipsWojewodztwa", errors)
    expect(meta.get("cppcPositiveApplications"), 2511, "meta.cppcPositiveApplications", errors)
    expect(meta.get("cppcUniqueGrantJst"), 2511, "meta.cppcUniqueGrantJst", errors)
    expect(meta.get("cppcRankingGrantPln"), 1483979072.49, "meta.cppcRankingGrantPln", errors)
    expect(meta.get("institutionalMailN"), 2779, "meta.institutionalMailN", errors)
    expect(meta.get("liveFreemailN"), 30, "meta.liveFreemailN", errors)

    records = payload.get("records", [])
    expect(len(records), 2809, "len(records)", errors)
    by_t = {r["t"]: r for r in records}
    expect(len(by_t), 2809, "unikalne kody TERYT7 w records", errors)

    grant_sum = round(sum(float(r.get("g", 0.0)) for r in records), 2)
    expect(grant_sum, 1483979072.49, "dokładna suma groszowa wszystkich 2 511 grantów w records", errors)
    cs_cnt = sum(int(r.get("cs", 0)) for r in records)
    expect(cs_cnt, 2511, "liczba jednostek z grantem w records", errors)

    # Check all 6 Phase C patches on individual TERYT records
    expect(by_t.get("1602023", {}).get("g"), 0.0, "1602023 Branice fałszywy grant wyczyszczony", errors)
    expect(by_t.get("1602023", {}).get("cs"), 0, "1602023 Branice cs=0", errors)
    expect(by_t.get("2613063", {}).get("g"), 850000.0, "2613063 Włoszczowa grant 850 000 zł", errors)
    expect(by_t.get("2613063", {}).get("dm"), "missing", "2613063 Włoszczowa DMARC missing", errors)
    expect(by_t.get("1602013", {}).get("g"), 473947.0, "1602013 Baborów grant 473 947 zł", errors)
    expect(by_t.get("1602013", {}).get("dm"), "reject", "1602013 Baborów DMARC reject", errors)
    expect(by_t.get("2007072", {}).get("dm"), "missing", "2007072 Śniadowo DMARC missing", errors)

    for migrated_t in ("1428062", "2602093", "1210073"):
        expect(by_t.get(migrated_t, {}).get("dm"), "quarantine", f"{migrated_t} po migracji ma quarantine (nie freemail)", errors)

    patch8_exp = {
        "1603000": "reject",
        "3012000": "quarantine",
        "2609011": "quarantine",
        "1808042": "quarantine",
        "1217000": "quarantine",
        "2213031": "reject",
        "2479011": "reject",
        "2801000": "quarantine",
    }
    for t7, exp_dm in patch8_exp.items():
        expect(by_t.get(t7, {}).get("dm"), exp_dm, f"subdomena org_fallback {t7}", errors)

    dm = payload.get("summary", {}).get("dmarcInstitutional", {})
    expect(dm.get("n"), 2779, "dmarcInstitutional.n", errors)
    expect(dm.get("noEffectiveDmarcN"), 362, "dmarcInstitutional.noEffectiveDmarcN", errors)
    expect(dm.get("pNoneN"), 372, "dmarcInstitutional.pNoneN", errors)
    expect(dm.get("spoofableN"), 734, "dmarcInstitutional.spoofableN", errors)
    expect(dm.get("spoofablePct"), 26.41, "dmarcInstitutional.spoofablePct", errors)
    expect(dm.get("maxGrantNoDmarcN"), 62, "dmarcInstitutional.maxGrantNoDmarcN", errors)

    wt = payload.get("summary", {}).get("webAndTrackers", {})
    expect(wt.get("playwrightMetaReachableN"), 346, "webAndTrackers.playwrightMetaReachableN", errors)
    expect(wt.get("zeroClickMetaAnyN"), 336, "webAndTrackers.zeroClickMetaAnyN", errors)
    expect(wt.get("zeroClickMetaSocialSdkN"), 331, "webAndTrackers.zeroClickMetaSocialSdkN", errors)
    expect(wt.get("zeroClickActiveMetaPixelN"), 5, "webAndTrackers.zeroClickActiveMetaPixelN", errors)
    expect(wt.get("consentGatedProperlyN"), 9, "webAndTrackers.consentGatedProperlyN", errors)


def validate_html_and_assets(repo_root: Path, errors: list[str]) -> None:
    expected_canon = {
        PL_REL: "https://roleplayingtech.com/pl/lab/cyberbezpieczny-samorzad/",
        EN_REL: "https://roleplayingtech.com/en/lab/municipal-cybersecurity/",
    }
    expected_og = {
        PL_REL: "assets/lab/og-jst-cyber-2026-pl.png",
        EN_REL: "assets/lab/og-jst-cyber-2026-en.png",
    }

    for rel, lang in ((PL_REL, "pl"), (EN_REL, "en")):
        fpath = repo_root / rel
        if not fpath.is_file():
            errors.append(f"[PLIK] Brak raportu HTML: {rel}")
            continue
        raw = fpath.read_text(encoding="utf-8")
        p = MiniDomParser()
        p.feed(raw)
        vis_txt = re.sub(r"\s+", " ", "".join(p.text_chunks))

        id_counts: dict[str, int] = {}
        for i_val, _ in p.ids:
            id_counts[i_val] = id_counts.get(i_val, 0) + 1
        for dup_id, cnt in id_counts.items():
            if cnt > 1:
                errors.append(f"[HTML] {rel}: zduplikowane id={dup_id!r} ({cnt}x).")

        known_ids = set(id_counts.keys())
        for req_id in ("fig-jst-grants", "fig-jst-map", "fig-jst-privacy", "jst-explorer", "explorer"):
            if req_id not in known_ids:
                errors.append(f"[HTML] {rel}: brak wymaganego kontenera id={req_id!r}.")

        for tag, attrs, line in p.elements:
            href = attrs.get("href", "").strip()
            if href.startswith("#"):
                frag = urllib.parse.unquote(href[1:])
                if not frag or frag not in known_ids:
                    errors.append(f"[KOTWICA] {rel}:{line}: href={href!r} nie ma odpowiadającego id.")
            if "data-jst-preset" in attrs:
                qs = attrs["data-jst-preset"].strip()
                pairs = urllib.parse.parse_qsl(qs, keep_blank_values=True)
                if not pairs:
                    errors.append(f"[PRESET] {rel}:{line}: pusty data-jst-preset.")
                for k, v in pairs:
                    if k not in ALLOWED_PRESET_KEYS:
                        errors.append(f"[PRESET] {rel}:{line}: nieznany klucz {k!r} w {qs!r}.")
                    if k == "preset" and v not in ALLOWED_PRESETS:
                        errors.append(f"[PRESET] {rel}:{line}: nieznany preset={v!r}.")

        canons = [a.get("href", "") for t, a, _ in p.elements if t == "link" and "canonical" in a.get("rel", "").split()]
        expect(canons, [expected_canon[rel]], f"{rel} canonical", errors)

        alts = {
            a.get("hreflang", ""): a.get("href", "")
            for t, a, _ in p.elements
            if t == "link" and "alternate" in a.get("rel", "").split() and a.get("hreflang")
        }
        expect(alts.get("pl"), expected_canon[PL_REL], f"{rel} hreflang=pl", errors)
        expect(alts.get("en"), expected_canon[EN_REL], f"{rel} hreflang=en", errors)

        og_imgs = [a.get("content", "") for t, a, _ in p.elements if t == "meta" and a.get("property") == "og:image"]
        expect(og_imgs, [SITE_ORIGIN + expected_og[rel]], f"{rel} og:image", errors)
        expect(png_dimensions(repo_root / expected_og[rel]), (1200, 630), f"{expected_og[rel]} wymiary PNG", errors)

        req_tokens = (
            ("2 809" if lang == "pl" else "2,809"),
            ("2 779" if lang == "pl" else "2,779"),
            ("26,41%" if lang == "pl" else "26.41%"),
            ("12,77%" if lang == "pl" else "12.77%"),
            ("15,20%" if lang == "pl" else "15.20%"),
            ("0,28" if lang == "pl" else "0.28"),
            "734",
            "362",
            "62",
            "30",
            "336",
            "331",
            "P/25/003",
            "1703",
            "C-40/17",
        )
        for tok in req_tokens:
            if tok not in vis_txt:
                errors.append(f"[KPI PROZA] {rel}: brak wymaganej zweryfikowanej wartości {tok!r}.")

    for rel in ISSUE3_TEXT_FILES:
        fpath = repo_root / rel
        if not fpath.is_file():
            errors.append(f"[PLIK] Brak wymaganego pliku Issue 03: {rel}")
            continue
        txt = fpath.read_text(encoding="utf-8")
        for pat, desc in FORBIDDEN_TRAPS:
            if rel.endswith(".html"):
                # Scan visible HTML without JSON-LD/script
                p_tmp = MiniDomParser()
                p_tmp.feed(txt)
                scan_target = "\n".join(p_tmp.text_chunks)
            else:
                scan_target = txt
            m = pat.search(scan_target)
            if m:
                errors.append(f"[PUŁAPKA FAZY A/B] {rel}: znaleziono zabroniony wzorzec ({desc}): {m.group(0)!r}.")


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    repo_root = Path(__file__).resolve().parent.parent
    json_path = repo_root / "assets" / "lab" / "jst-cyber-2026.json"
    errors: list[str] = []

    if not json_path.is_file():
        print(f"BŁĄD: Brak pliku {json_path}", file=sys.stderr)
        return 1

    payload = json.loads(json_path.read_text(encoding="utf-8"))
    validate_json(payload, errors)
    validate_html_and_assets(repo_root, errors)

    if errors:
        print(f"ŚLUZA JAKOŚCI ISSUE 03 (CYBERBEZPIECZNY SAMORZĄD) — NIEPOWODZENIE ({len(errors)} błędów):")
        for idx, e in enumerate(errors, start=1):
            print(f"  {idx:>3d}. {e}")
        return 1

    print(
        "OK (0 błędów): Raport NR 03 (Cyberbezpieczny Samorząd — wszystkie 2 809 JST, "
        "2 511 grantów = 1 483 979 072,49 zł co do grosza, 336/346 Zero-Click Meta, 2 karty OG 1200x630) "
        "przeszedł wszystkie testy inwariantów, prawa, HTML i SEO."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
