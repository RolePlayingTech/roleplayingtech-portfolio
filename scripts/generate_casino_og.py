#!/usr/bin/env python3
"""Generate 1200x630 editorial Open Graph cards (PL & EN) for Issue 02:
'Jak państwowe rejestry i strony .gov.pl napędzają ruch nielegalnym kasynom'.

Reads verified metrics from `assets/lab/casino-state-2026.json` and renders:
  - `assets/lab/og-casino-state-2026-pl.png`
  - `assets/lab/og-casino-state-2026-en.png`

Uses 2x supersampled Pillow rendering (2400x1260 -> 1200x630 LANCZOS) with
system TrueType fonts matching `assets/minimal.css` and `casino-explorer.css`.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "assets" / "lab" / "casino-state-2026.json"
OUT_PL = ROOT / "assets" / "lab" / "og-casino-state-2026-pl.png"
OUT_EN = ROOT / "assets" / "lab" / "og-casino-state-2026-en.png"

W, H = 1200, 630
SCALE = 2

# Editorial palette (1:1 with assets/minimal.css & assets/lab/casino-explorer.css)
BG = "#f7f6f2"
CARD_BG = "#fbfaf6"
PALE = "#eeece6"
INK = "#22211f"
BODY = "#3d3a36"
MUTED = "#68655f"
RULE = "#dbd7cd"
RULE_SOFT = "#e4e0d6"
TRACK_BORDER = "#d8d3c8"
RUST = "#98513c"
SLATE = "#3f5364"
BAR_MUTED = "#a39c90"


def find_font(candidates: Iterable[str], size_px: float) -> ImageFont.FreeTypeFont:
    scaled = max(10, int(round(size_px * SCALE)))
    search_dirs = [
        Path(r"C:\Windows\Fonts"),
        Path("/usr/share/fonts/truetype/dejavu"),
        Path("/usr/share/fonts/truetype/liberation"),
        Path("/System/Library/Fonts/Supplemental"),
        Path("/System/Library/Fonts"),
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


def load_fonts(headline_px: float = 47.0) -> dict[str, ImageFont.FreeTypeFont]:
    return {
        "h1_reg": find_font(["georgia.ttf", "Georgia.ttf", "LiberationSerif-Regular.ttf", "DejaVuSerif.ttf"], headline_px),
        "h1_ital": find_font(["georgiai.ttf", "Georgia Italic.ttf", "LiberationSerif-Italic.ttf", "DejaVuSerif-Italic.ttf"], headline_px),
        "kpi_num": find_font(["georgia.ttf", "Georgia.ttf", "LiberationSerif-Regular.ttf", "DejaVuSerif.ttf"], 36.0),
        "kpi_unit": find_font(["georgiab.ttf", "georgia.ttf", "LiberationSerif-Bold.ttf", "DejaVuSerif-Bold.ttf"], 16.0),
        "mono_xs": find_font(["consola.ttf", "Consolas.ttf", "LiberationMono-Regular.ttf", "DejaVuSansMono.ttf"], 10.0),
        "mono_xs_b": find_font(["consolab.ttf", "consola.ttf", "LiberationMono-Bold.ttf", "DejaVuSansMono-Bold.ttf"], 10.5),
        "mono_sm": find_font(["consola.ttf", "Consolas.ttf", "LiberationMono-Regular.ttf", "DejaVuSansMono.ttf"], 11.5),
        "mono_sm_b": find_font(["consolab.ttf", "consola.ttf", "LiberationMono-Bold.ttf", "DejaVuSansMono-Bold.ttf"], 11.5),
        "mono_md": find_font(["consola.ttf", "Consolas.ttf", "LiberationMono-Regular.ttf", "DejaVuSansMono.ttf"], 13.0),
        "mono_md_b": find_font(["consolab.ttf", "consola.ttf", "LiberationMono-Bold.ttf", "DejaVuSansMono-Bold.ttf"], 13.5),
        "sans_reg": find_font(["segoeui.ttf", "Arial.ttf", "LiberationSans-Regular.ttf", "DejaVuSans.ttf"], 11.8),
        "sans_sm": find_font(["segoeui.ttf", "Arial.ttf", "LiberationSans-Regular.ttf", "DejaVuSans.ttf"], 11.3),
        "sans_bold": find_font(["segoeuib.ttf", "seguisb.ttf", "Arial Bold.ttf", "LiberationSans-Bold.ttf", "DejaVuSans-Bold.ttf"], 13.0),
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
    funnel = summ["scanFunnel"]
    vectors = summ["vectors"]
    silos = summ["liveSilos"]
    mf = summ["mfRegister"]
    infra = summ["infrastructure"]
    surv = summ["survival"]

    gov_pages = int(silos["govAndBipUniquePages"])
    gov_anchors = int(silos["govAndBipRawDomAnchors"])
    mc_unblocked = int(silos["mcRes65294Unblocked"])

    img = Image.new("RGB", (W * SCALE, H * SCALE), BG)
    draw = ImageDraw.Draw(img)

    x0, x1 = 54, W - 54
    max_h1_w = x1 - x0 - 8

    for attempt_px in [47.0, 45.0, 43.0, 41.0, 39.0]:
        fonts = load_fonts(attempt_px)
        if lang == "pl":
            h1_lines = [
                [
                    ("Jak państwowe rejestry i strony ", fonts["h1_reg"], INK),
                    (".gov.pl", fonts["h1_ital"], RUST),
                ],
                [
                    ("napędzają ruch nielegalnym kasynom", fonts["h1_reg"], INK),
                ],
            ]
        else:
            h1_lines = [
                [
                    ("How Polish state registries and ", fonts["h1_reg"], INK),
                    (".gov.pl", fonts["h1_ital"], RUST),
                    (" portals", fonts["h1_reg"], INK),
                ],
                [
                    ("funnel traffic to unlicensed casinos", fonts["h1_reg"], INK),
                ],
            ]
        widest = max(
            sum(text_w(draw, t, fnt) for t, fnt, _ in line)
            for line in h1_lines
        )
        if widest <= max_h1_w:
            break

    # 1. Outer paper frame + top signature rule
    draw.rectangle([s(18), s(18), s(W - 18), s(H - 18)], outline=RULE, width=s(1))
    draw.rectangle([s(x0), s(42), s(x1), s(44)], fill=INK)

    # 2. Top metadata bar
    scanned_s = fmt_int(int(funnel["uniqueRegistrableRoots"]), lang)
    mf_total_s = fmt_int(int(mf["xmlTotalEntries"]), lang)
    if lang == "pl":
        eyebrow_left = "NR 02 · ŚLEDZTWO DANYCH · RSPO · RPWDL2 · ŻŁOBKI · MF"
        eyebrow_right = f"{scanned_s} DOMEN · {mf_total_s} WPISÓW MF"
    else:
        eyebrow_left = "ISSUE 02 · DATA INVESTIGATION · RSPO · RPWDL2 · MF"
        eyebrow_right = f"{scanned_s} DOMAINS · {mf_total_s} MF ENTRIES"

    draw.text((s(x0), s(55)), eyebrow_left, font=fonts["mono_md_b"], fill=RUST)
    rw = text_w(draw, eyebrow_right, fonts["mono_md"])
    draw.text((s(x1 - rw), s(55.5)), eyebrow_right, font=fonts["mono_md"], fill=MUTED)
    draw.line([(s(x0), s(82)), (s(x1), s(82))], fill=RULE, width=s(1))

    # 3. Serif editorial headline
    draw_runs(draw, x0, 94, h1_lines[0])
    draw_runs(draw, x0, 151, h1_lines[1])

    # 4. Data Zone (y = 228 .. 540): Left 3 KPI Cards + Right 10-Yr Surge & Vector Anatomy
    zone_top = 228
    zone_bot = 540
    left_x0, left_x1 = x0, 536       # 482px wide
    right_x0, right_x1 = 554, x1     # 592px wide

    unblocked_total = int(funnel["unblockedTotal"])
    still_live_primary = int(silos["unblockedLiveAnyPrimary"])
    end_to_end = int(funnel["endToEndUnblockedTotal"])
    km_n = int(surv["unblockedVecACount"]) + int(surv["mfCaughtPublicCount"])
    s90_val = float(surv["kaplanMeierCheckpoints"]["d90"])
    s90_s = fmt_num(s90_val, 1, lang)
    cf_pct_s = fmt_num(float(infra["cloudflareSyndicateAllPct"]), 1, lang)

    if lang == "pl":
        kpis = [
            {
                "num": str(unblocked_total),
                "unit": "domen",
                "accent": RUST,
                "tag": "AKTYWNE POZA BLOKADĄ DNS",
                "l1": f"{still_live_primary} nadal w żywych kartach RSPO/RPWDL2/Żłobków",
                "l2": f"({end_to_end} w 100% poza rejestrem MF w Polsce)",
            },
            {
                "num": str(gov_pages),
                "unit": "stron",
                "accent": INK,
                "tag": "LINKI DOFOLLOW Z .GOV.PL I BIP",
                "l1": f"{gov_anchors} żywych kotwic <a href> w oficjalnym DOM",
                "l2": f"(+ {mc_unblocked} domen w Wykazie MC dane.gov.pl)",
            },
            {
                "num": s90_s,
                "unit": "%",
                "accent": SLATE,
                "tag": "PRZEŻYCIE ≥ 90 DNI BEZ BLOKADY",
                "l1": f"estymator Kaplana–Meiera (N = {km_n}, mediana >317d)",
                "l2": f"{cf_pct_s}% ekosystemu stoi za proxy Cloudflare",
            },
        ]
    else:
        kpis = [
            {
                "num": str(unblocked_total),
                "unit": "domains",
                "accent": RUST,
                "tag": "ACTIVE & UNBLOCKED IN POLAND",
                "l1": f"{still_live_primary} still on live RSPO/RPWDL2/Nursery cards",
                "l2": f"({end_to_end} unblocked end-to-end across Polish ISPs)",
            },
            {
                "num": str(gov_pages),
                "unit": "pages",
                "accent": INK,
                "tag": "LIVE .GOV.PL & BIP DOFOLLOW LINKS",
                "l1": f"{gov_anchors} active <a href> anchors in official DOM",
                "l2": f"(+ {mc_unblocked} domains in Digital Affairs open data)",
            },
            {
                "num": s90_s,
                "unit": "%",
                "accent": SLATE,
                "tag": "SURVIVE ≥ 90 DAYS UNBLOCKED",
                "l1": f"Kaplan–Meier survival (N = {km_n}, median >317d)",
                "l2": f"{cf_pct_s}% of the ecosystem sits behind Cloudflare",
            },
        ]

    gap = 12
    card_h = (zone_bot - zone_top - 2 * gap) / 3.0
    for idx, kpi in enumerate(kpis):
        cy0 = zone_top + idx * (card_h + gap)
        cy1 = cy0 + card_h
        draw.rectangle(
            [s(left_x0), s(cy0), s(left_x1), s(cy1)],
            fill=CARD_BG,
            outline=RULE,
            width=s(1),
        )
        draw.rectangle(
            [s(left_x0), s(cy0), s(left_x0 + 3.5), s(cy1)],
            fill=kpi["accent"],
        )

        num_x = left_x0 + 17
        num_y = cy0 + 22
        num_color = RUST if kpi["accent"] == RUST else INK
        draw.text((s(num_x), s(num_y)), kpi["num"], font=fonts["kpi_num"], fill=num_color)
        nw = text_w(draw, kpi["num"], fonts["kpi_num"])
        draw.text(
            (s(num_x + nw + 5), s(num_y + 16)),
            kpi["unit"],
            font=fonts["kpi_unit"],
            fill=RUST,
        )

        div_x = left_x0 + 156
        draw.line(
            [(s(div_x), s(cy0 + 14)), (s(div_x), s(cy1 - 14))],
            fill=RULE_SOFT,
            width=s(1),
        )

        tx = div_x + 12
        draw.text((s(tx), s(cy0 + 14)), kpi["tag"], font=fonts["mono_sm_b"], fill=RUST)
        draw.text((s(tx), s(cy0 + 35)), kpi["l1"], font=fonts["sans_reg"], fill=BODY)
        draw.text((s(tx), s(cy0 + 54)), kpi["l2"], font=fonts["sans_reg"], fill=MUTED)
        assert tx + text_w(draw, kpi["l1"], fonts["sans_reg"]) <= left_x1 - 8, f"Overflow l1 ({lang}): {kpi['l1']}"
        assert tx + text_w(draw, kpi["l2"], fonts["sans_reg"]) <= left_x1 - 8, f"Overflow l2 ({lang}): {kpi['l2']}"

    # 5. Right Panel: 10-Year Surge of .pl Roots in MF Blocklist + 3-Vector Strip
    draw.rectangle(
        [s(right_x0), s(zone_top), s(right_x1), s(zone_bot)],
        fill=CARD_BG,
        outline=RULE,
        width=s(1),
    )
    draw.rectangle(
        [s(right_x0), s(zone_top), s(right_x1), s(zone_top + 2.5)],
        fill=INK,
    )

    px = right_x0 + 20
    pr = right_x1 - 20
    mult_s = fmt_num(float(mf["plSurgeFullPslMultiple"]), 1, lang)

    if lang == "pl":
        fig_kicker = f"UDZIAŁ DOMEN .PL W REJESTRZE HAZARDOWYM MF (2017–2026 · SKOK {mult_s}×)"
        fig_sub = "Nowe unikalne domeny główne eTLD+1 (deduplikacja chronologiczna PSL)"
    else:
        fig_kicker = f"SHARE OF .PL ROOTS IN POLAND'S GAMBLING BLOCKLIST (2017–2026 · {mult_s}×)"
        fig_sub = "First-seen unique eTLD+1 root domains per year (chronological PSL deduplication)"

    draw.text((s(px), s(zone_top + 13)), fig_kicker, font=fonts["mono_sm_b"], fill=RUST)
    draw.text((s(px), s(zone_top + 31)), fig_sub, font=fonts["sans_reg"], fill=MUTED)
    draw.line([(s(px), s(zone_top + 54)), (s(pr), s(zone_top + 54))], fill=RULE_SOFT, width=s(1))

    # Vertical columns for 2017..2026
    years_data = mf["series2017_2026"]
    chart_top = zone_top + 76
    chart_bot = zone_top + 218
    chart_h = chart_bot - chart_top
    max_pct = 24.0

    # Subtle horizontal gridlines (10%, 20%)
    for gv in (10.0, 20.0):
        gy = chart_bot - (gv / max_pct) * chart_h
        draw.line([(s(px), s(gy)), (s(pr), s(gy))], fill=RULE_SOFT, width=s(1))
        glbl = f"{int(gv)}%"
        draw.text((s(px), s(gy - 13)), glbl, font=fonts["mono_xs"], fill=MUTED)

    col_area_x0 = px + 32
    col_area_w = pr - col_area_x0
    n_years = len(years_data)
    slot_w = col_area_w / n_years
    bar_w = slot_w * 0.62

    draw.line([(s(col_area_x0 - 4), s(chart_bot)), (s(pr), s(chart_bot))], fill=INK, width=s(1))

    for i, yd in enumerate(years_data):
        yr = str(yd["year"])
        pct_val = float(yd["fullPslChronoPlPct"])
        bx0 = col_area_x0 + i * slot_w + (slot_w - bar_w) / 2.0
        bx1 = bx0 + bar_w
        bh = max(3.5, (pct_val / max_pct) * chart_h)
        by0 = chart_bot - bh

        is_surge = yr in ("2025", "2026")
        fill_col = RUST if yr == "2026" else ("#b97761" if yr == "2025" else BAR_MUTED)
        draw.rectangle(
            [s(bx0), s(by0), s(bx1), s(chart_bot)],
            fill=fill_col,
            outline=INK if yr == "2026" else TRACK_BORDER,
            width=s(1),
        )

        # Year label below axis
        yr_short = "'" + yr[2:]
        yw = text_w(draw, yr_short, fonts["mono_xs_b"] if yr == "2026" else fonts["mono_xs"])
        draw.text(
            (s(bx0 + (bar_w - yw) / 2.0), s(chart_bot + 5)),
            yr_short,
            font=fonts["mono_xs_b"] if yr == "2026" else fonts["mono_xs"],
            fill=INK if yr == "2026" else MUTED,
        )

        # Value callout on key years (2017, 2023, 2025, 2026)
        if yr in ("2017", "2023", "2025", "2026"):
            v_txt = fmt_num(pct_val, 2, lang) + "%"
            vf = fonts["mono_xs_b"] if is_surge else fonts["mono_xs"]
            vw = text_w(draw, v_txt, vf)
            draw.text(
                (s(bx0 + (bar_w - vw) / 2.0), s(by0 - 15)),
                v_txt,
                font=vf,
                fill=RUST if is_surge else BODY,
            )

    # Bottom strip inside Right Panel: 3 Technical Vectors (N = 291)
    strip_top = zone_top + 244
    draw.line([(s(px), s(strip_top)), (s(pr), s(strip_top))], fill=RULE_SOFT, width=s(1))

    vec_a = int(vectors["vectorA"]["count"])
    vec_b2 = int(vectors["vectorB2"]["count"])
    vec_b1 = int(vectors["vectorB1"]["count"])
    vec_b1_pub = int(vectors["vectorB1"]["activePublicInstitutionsCount"])

    if lang == "pl":
        vec_hdr = "TRZY WEKTORY TECHNICZNE (N = 291 NIEZABLOKOWANYCH):"
        vec_line = (
            f"A: wygasłe domeny {vec_a} (83,2%) · "
            f"B2: fasady PBN {vec_b2} (9,3%) · "
            f"B1: włamania PHP {vec_b1} ({vec_b1_pub} akt. publ. → CERT)"
        )
    else:
        vec_hdr = "THREE TECHNICAL VECTORS (N = 291 UNBLOCKED):"
        vec_line = (
            f"A: expired drop-catch {vec_a} (83.2%) · "
            f"B2: PBN facades {vec_b2} (9.3%) · "
            f"B1: live PHP hacks {vec_b1} ({vec_b1_pub} active pub. → CERT)"
        )

    draw.text((s(px), s(strip_top + 10)), vec_hdr, font=fonts["mono_xs_b"], fill=INK)
    draw.text((s(px), s(strip_top + 28)), vec_line, font=fonts["sans_sm"], fill=BODY)
    assert px + text_w(draw, vec_line, fonts["sans_sm"]) <= pr + 2, f"Overflow vec_line ({lang}): {vec_line}"

    # 6. Bottom editorial footer bar
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
        "dane: rspo.gov.pl · rpwdl2.ezdrowie.gov.pl · hazard.mf.gov.pl (11.2026)"
        if lang == "pl"
        else "data: rspo.gov.pl · rpwdl2.ezdrowie.gov.pl · hazard.mf.gov.pl (11.2026)"
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
    print(
        f"Generated {OUT_PL.relative_to(ROOT)} and {OUT_EN.relative_to(ROOT)} "
        f"({W}x{H} px) from {payload['summary']['scanFunnel']['uniqueRegistrableRoots']} audited roots."
    )


if __name__ == "__main__":
    main()
