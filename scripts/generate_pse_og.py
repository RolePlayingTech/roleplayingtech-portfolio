#!/usr/bin/env python3
"""Generate 1200x630 editorial Open Graph cards (PL & EN) for Issue 04:
'Wyłączamy tanie słońce, gdy prąd jest drogi. Co pokazały 73 924 kwadranse pracy sieci PSE'.

Reads verified metrics from `assets/lab/pse-grid-2026.json` and renders:
  - `assets/lab/og-pse-grid-2026-pl.png`
  - `assets/lab/og-pse-grid-2026-en.png`

Uses 2x supersampled Pillow rendering (2400x1260 -> 1200x630 LANCZOS) with
strict width assertions matching `assets/minimal.css`.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "assets" / "lab" / "pse-grid-2026.json"
OUT_PL = ROOT / "assets" / "lab" / "og-pse-grid-2026-pl.png"
OUT_EN = ROOT / "assets" / "lab" / "og-pse-grid-2026-en.png"

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


def load_fonts(headline_px: float = 46.0) -> dict[str, ImageFont.FreeTypeFont]:
    return {
        "h1_reg": find_font(["georgia.ttf", "Georgia.ttf", "DejaVuSerif.ttf"], headline_px),
        "h1_ital": find_font(["georgiai.ttf", "Georgia Italic.ttf", "DejaVuSerif-Italic.ttf"], headline_px),
        "kpi_num": find_font(["georgia.ttf", "Georgia.ttf", "DejaVuSerif.ttf"], 35.0),
        "kpi_unit": find_font(["georgiab.ttf", "georgia.ttf", "DejaVuSerif-Bold.ttf"], 15.5),
        "mono_xs": find_font(["consola.ttf", "Consolas.ttf", "DejaVuSansMono.ttf"], 10.0),
        "mono_xs_b": find_font(["consolab.ttf", "consola.ttf", "DejaVuSansMono-Bold.ttf"], 10.5),
        "mono_sm": find_font(["consola.ttf", "Consolas.ttf", "DejaVuSansMono.ttf"], 11.5),
        "mono_sm_b": find_font(["consolab.ttf", "consola.ttf", "DejaVuSansMono-Bold.ttf"], 11.5),
        "mono_md": find_font(["consola.ttf", "Consolas.ttf", "DejaVuSansMono.ttf"], 13.0),
        "mono_md_b": find_font(["consolab.ttf", "consola.ttf", "DejaVuSansMono-Bold.ttf"], 13.5),
        "sans_reg": find_font(["segoeui.ttf", "Arial.ttf", "DejaVuSans.ttf"], 11.6),
        "sans_sm": find_font(["segoeui.ttf", "Arial.ttf", "DejaVuSans.ttf"], 11.1),
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
    summ = payload["summary"]
    p26 = summ["periods"]["ytd_2026"]
    guil = summ["guillotine"]["period2025_2026"]
    ramp = summ["thermalRamp9Days"]
    q_total = fmt_int(int(payload["meta"]["continuousQuarters"]), lang)

    img = Image.new("RGB", (W * SCALE, H * SCALE), BG)
    draw = ImageDraw.Draw(img)

    x0, x1 = 54, W - 54
    max_h1_w = x1 - x0 - 8

    for attempt_px in [46.0, 44.0, 42.0, 40.0, 38.0]:
        fonts = load_fonts(attempt_px)
        if lang == "pl":
            h1_lines = [
                [
                    ("Wyłączamy tanie słońce, ", fonts["h1_reg"], INK),
                    ("gdy prąd jest drogi", fonts["h1_ital"], RUST),
                    (".", fonts["h1_reg"], INK),
                ],
                [
                    (f"Co pokazały {q_total} kwadranse pracy sieci PSE", fonts["h1_reg"], INK),
                ],
            ]
        else:
            h1_lines = [
                [
                    ("Shutting off cheap solar ", fonts["h1_reg"], INK),
                    ("when power is expensive", fonts["h1_ital"], RUST),
                    (".", fonts["h1_reg"], INK),
                ],
                [
                    (f"Inside {q_total} Polish grid intervals (2024–2026)", fonts["h1_reg"], INK),
                ],
            ]
        widest = max(sum(text_w(draw, t, fnt) for t, fnt, _ in line) for line in h1_lines)
        if widest <= max_h1_w:
            break

    draw.rectangle([s(18), s(18), s(W - 18), s(H - 18)], outline=RULE, width=s(1))
    draw.rectangle([s(x0), s(42), s(x1), s(44)], fill=INK)

    if lang == "pl":
        eyebrow_left = "NR 04 · ŚLEDZTWO DANYCH · PSE API · 106 BLOKÓW JWCD · 6 GRANIC"
        eyebrow_right = "2024–2026 · 1,81 TWh REDUKCJI"
    else:
        eyebrow_left = "ISSUE 04 · DATA INVESTIGATION · PSE TELEMETRY · 106 UNITS"
        eyebrow_right = "2024–2026 · 1.81 TWh CURTAILED"

    draw.text((s(x0), s(55)), eyebrow_left, font=fonts["mono_md_b"], fill=RUST)
    rw = text_w(draw, eyebrow_right, fonts["mono_md"])
    draw.text((s(x1 - rw), s(55.5)), eyebrow_right, font=fonts["mono_md"], fill=MUTED)
    draw.line([(s(x0), s(82)), (s(x1), s(82))], fill=RULE, width=s(1))

    draw_runs(draw, x0, 94, h1_lines[0])
    draw_runs(draw, x0, 151, h1_lines[1])

    zone_top = 228
    zone_bot = 540
    left_x0, left_x1 = x0, 540
    right_x0, right_x1 = 558, x1

    pos_pct = fmt_num(float(p26["rcePositiveSharePct"]), 1, lang)
    ge250_pct = fmt_num(float(p26["rceGe250SharePct"]), 1, lang)
    ge250_gwh = fmt_num(float(p26["rceGe250Gwh"]), 1, lang)
    guil_pct = fmt_num(float(guil["ge200"]["at00Pct"]), 2, lang)
    cen_mln = fmt_num(float(p26["valCenMax0Mln"]), 1, lang)
    rce_mln = fmt_num(float(p26["valRceMax0Mln"]), 1, lang)

    if lang == "pl":
        kpis = [
            {
                "num": pos_pct,
                "unit": "%",
                "accent": RUST,
                "tag": "REDUKCJI PRZY CENIE DODATNIEJ (RCE > 0)",
                "l1": f"{ge250_pct}% ({ge250_gwh} GWh) przy drogim prądzie ≥250 zł",
                "l2": "58,6% ściętego wolumenu przypada na dni robocze",
            },
            {
                "num": guil_pct,
                "unit": "%",
                "accent": INK,
                "tag": "SKOKÓW ≥ 200 MW W MINUCIE :00",
                "l1": "2 263 z 2 339 dużych cięć idzie pełną godziną",
                "l2": "(100% wszystkich skoków ≥ 500 MW bije o :00)",
            },
            {
                "num": cen_mln,
                "unit": "mln zł",
                "accent": SLATE,
                "tag": "WYCENA USTAWOWA KC WG CEN (2026 YTD)",
                "l1": f"vs {rce_mln} mln zł wg RCE i 105,5 mln zł gotówki",
                "l2": "poślizg 6–18 mies. + 0 zł dla umów z art. 7 ust. 9",
            },
        ]
    else:
        kpis = [
            {
                "num": pos_pct,
                "unit": "%",
                "accent": RUST,
                "tag": "CURTAILED AT POSITIVE PRICES (RCE > 0)",
                "l1": f"{ge250_pct}% ({ge250_gwh} GWh) at expensive ≥250 PLN/MWh",
                "l2": "58.6% of curtailed green power falls on weekdays",
            },
            {
                "num": guil_pct,
                "unit": "%",
                "accent": INK,
                "tag": "JUMPS ≥ 200 MW HIT ON MINUTE :00",
                "l1": "2,263 of 2,339 large cuts act as hourly blocks",
                "l2": "(100% of all ≥ 500 MW jumps fire at :00)",
            },
            {
                "num": cen_mln,
                "unit": "M PLN",
                "accent": SLATE,
                "tag": "STATUTORY CEN VALUATION (2026 YTD)",
                "l1": f"vs {rce_mln}M RCE value & 105.5M cash paid so far",
                "l2": "6–18 mo settlement lag + 0 PLN commercial grid cap",
            },
        ]

    gap = 12
    card_h = (zone_bot - zone_top - 2 * gap) / 3.0
    for idx, kpi in enumerate(kpis):
        cy0 = zone_top + idx * (card_h + gap)
        cy1 = cy0 + card_h
        draw.rectangle([s(left_x0), s(cy0), s(left_x1), s(cy1)], fill=CARD_BG, outline=RULE, width=s(1))
        draw.rectangle([s(left_x0), s(cy0), s(left_x0 + 3.5), s(cy1)], fill=kpi["accent"])

        num_x = left_x0 + 16
        num_y = cy0 + 23
        num_color = RUST if kpi["accent"] == RUST else INK
        draw.text((s(num_x), s(num_y)), kpi["num"], font=fonts["kpi_num"], fill=num_color)
        nw = text_w(draw, kpi["num"], fonts["kpi_num"])
        draw.text((s(num_x + nw + 5), s(num_y + 16)), kpi["unit"], font=fonts["kpi_unit"], fill=RUST)

        div_x = left_x0 + 166
        draw.line([(s(div_x), s(cy0 + 14)), (s(div_x), s(cy1 - 14))], fill=RULE_SOFT, width=s(1))

        tx = div_x + 12
        draw.text((s(tx), s(cy0 + 14)), kpi["tag"], font=fonts["mono_sm_b"], fill=RUST)
        draw.text((s(tx), s(cy0 + 35)), kpi["l1"], font=fonts["sans_reg"], fill=BODY)
        draw.text((s(tx), s(cy0 + 54)), kpi["l2"], font=fonts["sans_reg"], fill=MUTED)
        assert tx + text_w(draw, kpi["l1"], fonts["sans_reg"]) <= left_x1 - 6, f"Overflow l1 ({lang}): {kpi['l1']}"
        assert tx + text_w(draw, kpi["l2"], fonts["sans_reg"], ) <= left_x1 - 6, f"Overflow l2 ({lang}): {kpi['l2']}"

    # Right Panel: 24-Hour Thermal Floor & Evening Ramp (9 curtailment weekdays)
    draw.rectangle([s(right_x0), s(zone_top), s(right_x1), s(zone_bot)], fill=CARD_BG, outline=RULE, width=s(1))
    draw.rectangle([s(right_x0), s(zone_top), s(right_x1), s(zone_top + 2.5)], fill=INK)

    px = right_x0 + 20
    pr = right_x1 - 20
    if lang == "pl":
        fig_kicker = "BETON TERMICZNY W POŁUDNIE VS RAMPA NA 20:00 (106 BLOKÓW GEN-JW)"
        fig_sub = "Średni profil 9 roboczych dni drogich redukcji: 7,98 GW (12:00) → 13,63 GW (20:00)"
    else:
        fig_kicker = "MIDDAY THERMAL FLOOR VS 20:00 RAMP (106 UNITS IN GEN-JW)"
        fig_sub = "Mean profile of 9 expensive-curtailment weekdays: 7.98 GW (12:00) → 13.63 GW (20:00)"

    draw.text((s(px), s(zone_top + 13)), fig_kicker, font=fonts["mono_sm_b"], fill=RUST)
    draw.text((s(px), s(zone_top + 31)), fig_sub, font=fonts["sans_reg"], fill=MUTED)
    draw.line([(s(px), s(zone_top + 54)), (s(pr), s(zone_top + 54))], fill=RULE_SOFT, width=s(1))

    hourly = ramp["hourly"]
    chart_top = zone_top + 74
    chart_bot = zone_top + 220
    chart_h = chart_bot - chart_top
    max_gw = 15.0

    col_x0 = px + 34
    col_w = pr - col_x0

    for gv in (5.0, 10.0, 15.0):
        gy = chart_bot - (gv / max_gw) * chart_h
        draw.line([(s(col_x0), s(gy)), (s(pr), s(gy))], fill=RULE_SOFT, width=s(1))
        draw.text((s(px), s(gy - 7)), f"{int(gv)}GW", font=fonts["mono_xs"], fill=MUTED)

    draw.line([(s(col_x0), s(chart_bot)), (s(pr), s(chart_bot))], fill=INK, width=s(1))

    # Draw PV curve (amber shaded/line), Curtailed RES bars (rust), and Thermal Floor line (dark ink/coal)
    slot_w = col_w / 24.0
    th_pts = []
    pv_pts = []
    for i, hrow in enumerate(hourly):
        cx = col_x0 + (i + 0.5) * slot_w
        th_gw = float(hrow["thermalTotalMw"]) / 1000.0
        pv_gw = float(hrow["pvMw"]) / 1000.0
        curt_gw = float(hrow["curtailedMw"]) / 1000.0

        # Curtailed RES vertical rust bar at bottom
        if curt_gw > 0.05:
            bh = (curt_gw / max_gw) * chart_h
            draw.rectangle(
                [s(cx - slot_w * 0.32), s(chart_bot - bh), s(cx + slot_w * 0.32), s(chart_bot)],
                fill="#d99a87",
                outline=RUST,
                width=s(1),
            )

        th_pts.append((s(cx), s(chart_bot - (th_gw / max_gw) * chart_h)))
        pv_pts.append((s(cx), s(chart_bot - (min(pv_gw, max_gw) / max_gw) * chart_h)))

        if i in (0, 6, 12, 16, 20, 23):
            hlbl = f"{i:02d}:00"
            hw = text_w(draw, hlbl, fonts["mono_xs"])
            draw.text((s(cx - hw / 2.0), s(chart_bot + 5)), hlbl, font=fonts["mono_xs"], fill=MUTED)

    draw.line(pv_pts, fill=AMBER, width=s(2.2))
    draw.line(th_pts, fill=INK, width=s(2.8))

    # Highlight 12:00 floor & 20:00 peak dots + labels
    p12 = th_pts[12]
    p20 = th_pts[20]
    for pt, col in ((p12, SLATE), (p20, RUST)):
        draw.ellipse([pt[0] - s(4), pt[1] - s(4), pt[0] + s(4), pt[1] + s(4)], fill=col, outline=CARD_BG, width=s(1))

    l12 = "12:00 · 7,98 GW" if lang == "pl" else "12:00 · 7.98 GW"
    l20 = "20:00 · 13,63 GW (+5,64 GW)" if lang == "pl" else "20:00 · 13.63 GW (+5.64 GW)"
    w12 = text_w(draw, l12, fonts["mono_xs_b"])
    x12 = p12[0] / SCALE - w12 / 2.0
    y12 = p12[1] / SCALE - 21
    draw.rectangle([s(x12 - 4), s(y12 - 2), s(x12 + w12 + 4), s(y12 + 13)], fill=CARD_BG, outline=RULE_SOFT, width=s(1))
    draw.text((s(x12), s(y12)), l12, font=fonts["mono_xs_b"], fill=SLATE)
    w20 = text_w(draw, l20, fonts["mono_xs_b"])
    x20 = pr - w20
    y20 = p20[1] / SCALE - 20
    draw.rectangle([s(x20 - 4), s(y20 - 2), s(x20 + w20 + 3), s(y20 + 13)], fill=CARD_BG, outline=RULE_SOFT, width=s(1))
    draw.text((s(x20), s(y20)), l20, font=fonts["mono_xs_b"], fill=RUST)

    # Bottom strip: Legend + German loop flow vs HVDC import
    strip_top = zone_top + 244
    draw.line([(s(px), s(strip_top)), (s(pr), s(strip_top))], fill=RULE_SOFT, width=s(1))
    if lang == "pl":
        leg_hdr = "CZARNA LINIA: BLOKI CIEPLNE · BURSZTYN: PV · RDZAWE SŁUPKI: ŚCIĘTE OZE"
        leg_sub = "Granice (RCE ≥250): Niemcy +605 MW przepływu kołowego · Litwa +79 MW i Szwecja +66 MW handlowo"
    else:
        leg_hdr = "BLACK: THERMAL FLOOR · AMBER: SOLAR PV · RUST BARS: CURTAILED RES"
        leg_sub = "Borders (RCE ≥250): Germany +605 MW loop flow · Lithuania +79 MW & Sweden +66 MW scheduled import"

    draw.text((s(px), s(strip_top + 10)), leg_hdr, font=fonts["mono_xs_b"], fill=INK)
    draw.text((s(px), s(strip_top + 28)), leg_sub, font=fonts["sans_sm"], fill=BODY)
    assert px + text_w(draw, leg_sub, fonts["sans_sm"]) <= pr + 4, f"Overflow leg_sub ({lang}): {leg_sub}"

    foot_rule_y = 558
    draw.line([(s(x0), s(foot_rule_y)), (s(x1), s(foot_rule_y))], fill=INK, width=s(1))
    foot_y = 573
    draw_runs(
        draw,
        x0,
        foot_y,
        [
            ("roleplayingtech", fonts["mono_md_b"], INK),
            (".", fonts["mono_md_b"], RUST),
            ("com", fonts["mono_md_b"], INK),
            ("  ·  ", fonts["mono_md"], RUST),
            ("Grzegorz Stuczyński", fonts["mono_md"], INK),
        ],
    )
    foot_right = (
        "dane: api.raporty.pse.pl · pse.pl · ure.gov.pl (09.2024–11.2026)"
        if lang == "pl"
        else "data: api.raporty.pse.pl · pse.pl · ure.gov.pl (09.2024–11.2026)"
    )
    fr_w = text_w(draw, foot_right, fonts["mono_md"])
    draw.text((s(x1 - fr_w), s(foot_y)), foot_right, font=fonts["mono_md"], fill=MUTED)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    final_img = img.resize((W, H), Image.Resampling.LANCZOS)
    final_img.save(out_path, format="PNG", optimize=True)


def main() -> None:
    payload = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    render_card(payload, "pl", OUT_PL)
    render_card(payload, "en", OUT_EN)
    print(f"Generated {OUT_PL.relative_to(ROOT)} and {OUT_EN.relative_to(ROOT)} ({W}x{H} px).")


if __name__ == "__main__":
    main()
