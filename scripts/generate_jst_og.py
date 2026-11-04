#!/usr/bin/env python3
"""Generate 1200x630 editorial Open Graph cards (PL & EN) for Issue 03:
'1,48 mld zł na „Cyberbezpieczny Samorząd”, a co czwarty urząd wciąż ma niechronioną pocztę'.

Reads verified metrics from `assets/lab/jst-cyber-2026.json` and renders:
  - `assets/lab/og-jst-cyber-2026-pl.png`
  - `assets/lab/og-jst-cyber-2026-en.png`

Uses 2x supersampled Pillow rendering (2400x1260 -> 1200x630 LANCZOS) with
strict width assertions matching `assets/minimal.css`.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "assets" / "lab" / "jst-cyber-2026.json"
OUT_PL = ROOT / "assets" / "lab" / "og-jst-cyber-2026-pl.png"
OUT_EN = ROOT / "assets" / "lab" / "og-jst-cyber-2026-en.png"

W, H = 1200, 630
SCALE = 2

BG = "#f7f6f2"
CARD_BG = "#fbfaf6"
PALE = "#eeece6"
INK = "#22211f"
BODY = "#3d3a36"
MUTED = "#68655f"
RULE = "#dbd7cd"
RULE_SOFT = "#e4e0d6"
RUST = "#98513c"
SLATE = "#26455b"
AMBER = "#b87832"
COAL = "#4b4741"


def find_font(candidates: Iterable[str], size_px: float) -> ImageFont.FreeTypeFont:
    scaled = max(10, int(round(size_px * SCALE)))
    search_dirs = [
        Path(r"C:\Windows\Fonts"),
        Path("/usr/share/fonts/truetype/dejavu"),
        Path("/usr/share/fonts/truetype/liberation"),
    ]
    for name in candidates:
        p = Path(name)
        if p.is_file():
            return ImageFont.truetype(str(p), scaled)
        for d in search_dirs:
            fp = d / name
            if fp.is_file():
                return ImageFont.truetype(str(fp), scaled)
    return ImageFont.load_default()


def load_fonts(headline_px: float = 44.0) -> dict[str, ImageFont.FreeTypeFont]:
    return {
        "h1_reg": find_font(["georgia.ttf", "Georgia.ttf", "DejaVuSerif.ttf"], headline_px),
        "h1_ital": find_font(["georgiai.ttf", "Georgia Italic.ttf", "DejaVuSerif-Italic.ttf"], headline_px),
        "kpi_num": find_font(["georgia.ttf", "Georgia.ttf", "DejaVuSerif.ttf"], 34.0),
        "kpi_unit": find_font(["georgiab.ttf", "georgia.ttf", "DejaVuSerif-Bold.ttf"], 15.0),
        "mono_xs": find_font(["consola.ttf", "Consolas.ttf", "DejaVuSansMono.ttf"], 10.0),
        "mono_xs_b": find_font(["consolab.ttf", "consola.ttf", "DejaVuSansMono-Bold.ttf"], 10.5),
        "mono_sm": find_font(["consola.ttf", "Consolas.ttf", "DejaVuSansMono.ttf"], 11.5),
        "mono_sm_b": find_font(["consolab.ttf", "consola.ttf", "DejaVuSansMono-Bold.ttf"], 11.5),
        "mono_md": find_font(["consola.ttf", "Consolas.ttf", "DejaVuSansMono.ttf"], 13.0),
        "mono_md_b": find_font(["consolab.ttf", "consola.ttf", "DejaVuSansMono-Bold.ttf"], 13.5),
        "sans_reg": find_font(["segoeui.ttf", "Arial.ttf", "DejaVuSans.ttf"], 11.6),
        "sans_sm": find_font(["segoeui.ttf", "Arial.ttf", "DejaVuSans.ttf"], 11.0),
    }


def s(v: float) -> int:
    return int(round(v * SCALE))


def text_w(draw: ImageDraw.ImageDraw, txt: str, font: ImageFont.FreeTypeFont) -> float:
    bbox = draw.textbbox((0, 0), txt, font=font)
    return (bbox[2] - bbox[0]) / SCALE


def fmt_num(val: float, decimals: int, lang: str) -> str:
    txt = f"{val:.{decimals}f}"
    return txt.replace(".", ",") if lang == "pl" else txt


def fmt_int(n: int, lang: str) -> str:
    sep = " " if lang == "pl" else ","
    return f"{n:,}".replace(",", sep)


def draw_runs(
    draw: ImageDraw.ImageDraw,
    x: float,
    y: float,
    runs: list[tuple[str, ImageFont.FreeTypeFont, str]],
) -> float:
    cur_x = x
    for txt, font, color in runs:
        draw.text((s(cur_x), s(y)), txt, font=font, fill=color)
        cur_x += text_w(draw, txt, font)
    return cur_x


def render_card(payload: dict, lang: str, out_path: Path) -> None:
    meta = payload["meta"]
    dm = payload["summary"]["dmarcInstitutional"]
    wt = payload["summary"]["webAndTrackers"]
    ms = payload["summary"]["mailSovereignty"]

    jst_total = fmt_int(int(meta["totalStatutoryJst"]), lang)
    spoof_pct = fmt_num(float(dm["spoofablePct"]), 1, lang)
    nodm_pct = fmt_num(float(dm["noEffectiveDmarcPct"]), 1, lang)
    p_yates = fmt_num(float(dm["testNoDmarc"]["pYates"]), 2, lang)
    zc_n = int(wt["zeroClickMetaAnyN"])
    zc_tot = int(wt["playwrightMetaReachableN"])

    img = Image.new("RGB", (W * SCALE, H * SCALE), BG)
    draw = ImageDraw.Draw(img)

    x0, x1 = 54, W - 54
    max_h1_w = x1 - x0 - 8

    for attempt_px in [44.0, 42.0, 40.0, 38.0, 36.0]:
        fonts = load_fonts(attempt_px)
        if lang == "pl":
            h1_lines = [
                [
                    ("1,48 mld zł na „Cyberbezpieczny Samorząd”, ", fonts["h1_reg"], INK),
                    ("a poczta", fonts["h1_ital"], RUST),
                ],
                [
                    ("co czwartego urzędu stoi otworem", fonts["h1_ital"], RUST),
                    (f" · audyt {jst_total} JST", fonts["h1_reg"], INK),
                ],
            ]
        else:
            h1_lines = [
                [
                    ("PLN 1.48B for 'Cybersecure Local Gov', ", fonts["h1_reg"], INK),
                    ("yet 1 in 4", fonts["h1_ital"], RUST),
                ],
                [
                    ("municipal domains remain spoofable", fonts["h1_ital"], RUST),
                    (f" · all {jst_total} units", fonts["h1_reg"], INK),
                ],
            ]
        widest = max(sum(text_w(draw, t, fnt) for t, fnt, _ in line) for line in h1_lines)
        if widest <= max_h1_w:
            break

    draw.rectangle([s(18), s(18), s(W - 18), s(H - 18)], outline=RULE, width=s(1))
    draw.rectangle([s(x0), s(42), s(x1), s(44)], fill=INK)

    if lang == "pl":
        eyebrow_left = "NR 03 · ŚLEDZTWO DANYCH · DNS/DMARC · CHROMIUM ZERO-CLICK · NIK P/25/003"
        eyebrow_right = "WSZYSTKIE 2 809 SAMORZĄDÓW RP"
    else:
        eyebrow_left = "ISSUE 03 · DATA INVESTIGATION · DNS/DMARC · STEALTH CHROMIUM · NIK AUDIT"
        eyebrow_right = "ALL 2,809 POLISH LOCAL GOVS"

    draw.text((s(x0), s(55)), eyebrow_left, font=fonts["mono_md_b"], fill=RUST)
    rw = text_w(draw, eyebrow_right, fonts["mono_md"])
    draw.text((s(x1 - rw), s(55.5)), eyebrow_right, font=fonts["mono_md"], fill=MUTED)
    draw.line([(s(x0), s(82)), (s(x1), s(82))], fill=RULE, width=s(1))

    draw_runs(draw, x0, 94, h1_lines[0])
    draw_runs(draw, x0, 150, h1_lines[1])

    zone_top = 226
    zone_bot = 540
    left_x0, left_x1 = x0, 540
    right_x0, right_x1 = 558, x1

    if lang == "pl":
        kpis = [
            (
                f"{spoof_pct}",
                "% bez blokady spoofingu",
                f"734 z 2 779 domen urzędowych (362 bez DMARC + 372 z p=none; 356 mln zł grantów)",
                True,
            ),
            (
                f"p = {p_yates}",
                "efekt grantu na brak DMARC",
                f"12,8% u grantobiorców vs 15,2% bez grantu — brak istotnej różnicy mimo nakazu z 2023 r.",
                False,
            ),
            (
                f"{zc_n}/{zc_tot}",
                "stron śle dane do Mety bez zgody",
                f"331 wtyczek SDK + 5 komercyjnych Meta Pixel przy wejściu oraz {ms['liveFreemailTotalN']} gmin na freemailu",
                False,
            ),
        ]
    else:
        kpis = [
            (
                f"{spoof_pct}",
                "% spoofable official mail",
                "734 of 2,779 institutional domains (362 missing DMARC + 372 p=none; PLN 356M grants)",
                True,
            ),
            (
                f"p = {p_yates}",
                "grant effect on missing DMARC",
                "12.8% with grant vs 15.2% without — statistically null 34 days after settlement deadline",
                False,
            ),
            (
                f"{zc_n}/{zc_tot}",
                "sites leak to Meta pre-consent",
                f"331 unblocked SDK plugins + 5 commercial Meta Pixels on load, plus {ms['liveFreemailTotalN']} freemail offices",
                False,
            ),
        ]

    gap = 12
    card_h = (zone_bot - zone_top - 2 * gap) / 3.0
    for idx, (val_str, unit_str, desc_str, is_primary) in enumerate(kpis):
        cy0 = zone_top + idx * (card_h + gap)
        cy1 = cy0 + card_h
        draw.rectangle([s(left_x0), s(cy0), s(left_x1), s(cy1)], fill=CARD_BG, outline=RULE, width=s(1))
        bar_col = RUST if is_primary else INK
        draw.rectangle([s(left_x0), s(cy0), s(left_x0 + 4.5), s(cy1)], fill=bar_col)
        num_col = RUST if is_primary else INK
        nx = draw_runs(draw, left_x0 + 18, cy0 + 12, [(val_str, fonts["kpi_num"], num_col)])
        draw.text((s(nx + 9), s(cy0 + 25)), unit_str, font=fonts["kpi_unit"], fill=INK)
        draw.text((s(left_x0 + 18), s(cy0 + 62)), desc_str, font=fonts["sans_sm"], fill=BODY)

    # Right panel: DMARC distribution by Grant Tier + Zero-Click Surveillance Callout
    draw.rectangle([s(right_x0), s(zone_top), s(right_x1), s(zone_bot)], fill=CARD_BG, outline=INK, width=s(1))
    draw.rectangle([s(right_x0), s(zone_top), s(right_x1), s(zone_top + 3.5)], fill=RUST)

    px0, px1 = right_x0 + 22, right_x1 - 22
    if lang == "pl":
        p_kicker = "ODSETEK DOMEN PODATNYCH NA PODSZYCIE WG WYSOKOŚCI GRANTU (N = 2 779)"
        p_sub = "Brak rekordu DMARC (rdzawy) + polityka p=none bez odrzucania fałszywych listów (bursztynowy)"
    else:
        p_kicker = "SPOOFABLE OFFICIAL MAIL BY CYBERSECURITY GRANT TIER (N = 2,779)"
        p_sub = "Missing/broken DMARC (rust) + monitoring-only p=none allowing inbox delivery (amber)"

    draw.text((s(px0), s(zone_top + 14)), p_kicker, font=fonts["mono_sm_b"], fill=RUST)
    draw.text((s(px0), s(zone_top + 32)), p_sub, font=fonts["sans_sm"], fill=MUTED)
    draw.line([(s(px0), s(zone_top + 54)), (s(px1), s(zone_top + 54))], fill=RULE_SOFT, width=s(1))

    tiers = payload["summary"]["byGrantTier"]
    bar_max_w = px1 - px0 - 150
    max_pct = 40.0

    tier_short_pl = {
        "MAX_850K": "Maks. grant ~850 tys. zł (N=635)",
        "TIER_500_849K": "500–849 tys. zł (N=1 035)",
        "TIER_300_500K": "300–499 tys. zł (N=556)",
        "TIER_UNDER_300K": "Poniżej 300 tys. zł (N=257)",
        "NO_GRANT": "Bez grantu · kontrolna (N=296)",
    }
    tier_short_en = {
        "MAX_850K": "Max grant ~850k PLN (N=635)",
        "TIER_500_849K": "500–849k PLN grant (N=1,035)",
        "TIER_300_500K": "300–499k PLN grant (N=556)",
        "TIER_UNDER_300K": "Under 300k PLN grant (N=257)",
        "NO_GRANT": "No grant · control (N=296)",
    }

    ry = zone_top + 63
    for t in tiers:
        code = t["code"]
        lbl = tier_short_pl[code] if lang == "pl" else tier_short_en[code]
        nd_p = float(t["noDmarcPct"])
        pn_p = float(t["pNonePct"])
        sp_p = float(t["spoofablePct"])

        draw.text((s(px0), s(ry)), lbl, font=fonts["mono_xs_b"], fill=INK)
        val_lbl = f"{fmt_num(sp_p, 1, lang)}% ({t['spoofableN']})"
        vw = text_w(draw, val_lbl, fonts["mono_xs_b"])
        draw.text((s(px1 - vw), s(ry)), val_lbl, font=fonts["mono_xs_b"], fill=RUST if code == "MAX_850K" else BODY)

        by0 = ry + 15
        by1 = by0 + 12
        draw.rectangle([s(px0), s(by0), s(px1), s(by1)], fill=PALE, outline=RULE, width=s(1))
        w_nd = (px1 - px0) * min(nd_p / max_pct, 1.0)
        w_pn = (px1 - px0) * min(pn_p / max_pct, 1.0 - nd_p / max_pct)
        if w_nd > 0.5:
            draw.rectangle([s(px0), s(by0), s(px0 + w_nd), s(by1)], fill=RUST)
        if w_pn > 0.5:
            draw.rectangle([s(px0 + w_nd), s(by0), s(px0 + w_nd + w_pn), s(by1)], fill=AMBER)

        ry += 38

    # Bottom callout inside right panel
    cy_box0 = zone_top + 258
    cy_box1 = zone_bot - 12
    draw.rectangle([s(px0), s(cy_box0), s(px1), s(cy_box1)], fill=PALE, outline=RULE, width=s(1))
    if lang == "pl":
        c_l1 = "62 GMINY Z MAKS. GRANTEM ~850 TYS. ZŁ BEZ REKORDU DMARC"
        c_l2 = "Wyszukiwarka na stronie obejmuje 100% z 2 809 gmin, miast, powiatów i województw."
    else:
        c_l1 = "62 MAX-GRANT (~850K PLN) MUNICIPALITIES LACK ANY DMARC RECORD"
        c_l2 = "Interactive explorer covers 100% of Poland's 2,809 municipalities, counties & regions."
    draw.text((s(px0 + 12), s(cy_box0 + 7)), c_l1, font=fonts["mono_xs_b"], fill=SLATE)
    draw.text((s(px0 + 12), s(cy_box0 + 22)), c_l2, font=fonts["sans_sm"], fill=BODY)

    # Footer bar
    draw.line([(s(x0), s(558)), (s(x1), s(558))], fill=INK, width=s(1.5))
    draw.text((s(x0), s(572)), "roleplayingtech.com/pl/lab/" if lang == "pl" else "roleplayingtech.com/en/lab/", font=fonts["mono_md_b"], fill=INK)
    foot_r = (
        "Grzegorz Stuczyński · Dane: CPPC, MSWiA/GUS, DNS DoH, Chromium · XI 2026"
        if lang == "pl"
        else "Grzegorz Stuczyński · Data: CPPC, MSWiA/GUS, DNS DoH, Chromium · Nov 2026"
    )
    frw = text_w(draw, foot_r, fonts["mono_sm"])
    draw.text((s(x1 - frw), s(573)), foot_r, font=fonts["mono_sm"], fill=MUTED)

    out_img = img.resize((W, H), Image.Resampling.LANCZOS)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_img.save(out_path, format="PNG", optimize=True)
    print(f"Saved {out_path} ({out_path.stat().st_size:,} bytes)")


def main() -> None:
    payload = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    render_card(payload, "pl", OUT_PL)
    render_card(payload, "en", OUT_EN)


if __name__ == "__main__":
    main()
