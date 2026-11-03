#!/usr/bin/env python3
"""Generate 1200x630 editorial Open Graph cards (PL & EN) for the BZP AI report.

Reads live figures from `assets/lab/bzp-ai-2024-2026.json` and renders:
  - `assets/lab/og-bzp-2024-2026-pl.png`
  - `assets/lab/og-bzp-2024-2026-en.png`

Uses 2x supersampled Pillow rendering (2400x1260 -> 1200x630 LANCZOS) with
system TrueType fonts matching `assets/minimal.css` and `bzp-explorer.css`.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "assets" / "lab" / "bzp-ai-2024-2026.json"
OUT_PL = ROOT / "assets" / "lab" / "og-bzp-2024-2026-pl.png"
OUT_EN = ROOT / "assets" / "lab" / "og-bzp-2024-2026-en.png"

W, H = 1200, 630
SCALE = 2  # 2x supersampling for crisp typography and hairlines

# Editorial palette (1:1 with assets/minimal.css & assets/lab/bzp-explorer.css)
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
BAR_PROC = "#9c9589"


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


def load_fonts(headline_px: float = 50.0) -> dict[str, ImageFont.FreeTypeFont]:
    return {
        "h1_reg": find_font(["georgia.ttf", "Georgia.ttf", "LiberationSerif-Regular.ttf", "DejaVuSerif.ttf"], headline_px),
        "h1_ital": find_font(["georgiai.ttf", "Georgia Italic.ttf", "LiberationSerif-Italic.ttf", "DejaVuSerif-Italic.ttf"], headline_px),
        "kpi_num": find_font(["georgia.ttf", "Georgia.ttf", "LiberationSerif-Regular.ttf", "DejaVuSerif.ttf"], 36.5),
        "kpi_unit": find_font(["georgiab.ttf", "georgia.ttf", "LiberationSerif-Bold.ttf", "DejaVuSerif-Bold.ttf"], 16.5),
        "mono_sm": find_font(["consola.ttf", "Consolas.ttf", "LiberationMono-Regular.ttf", "DejaVuSansMono.ttf"], 11.5),
        "mono_sm_b": find_font(["consolab.ttf", "consola.ttf", "LiberationMono-Bold.ttf", "DejaVuSansMono-Bold.ttf"], 11.5),
        "mono_md": find_font(["consola.ttf", "Consolas.ttf", "LiberationMono-Regular.ttf", "DejaVuSansMono.ttf"], 13.0),
        "mono_md_b": find_font(["consolab.ttf", "consola.ttf", "LiberationMono-Bold.ttf", "DejaVuSansMono-Bold.ttf"], 13.5),
        "sans_reg": find_font(["segoeui.ttf", "Arial.ttf", "LiberationSans-Regular.ttf", "DejaVuSans.ttf"], 13.0),
        "sans_bold": find_font(["segoeuib.ttf", "seguisb.ttf", "Arial Bold.ttf", "LiberationSans-Bold.ttf", "DejaVuSans-Bold.ttf"], 13.5),
    }


def compute_stats(records: list[dict]) -> dict:
    total_proc = len(records)
    core = [r for r in records if r.get("category") != "incidental"]
    signed_core = [
        r for r in core
        if r.get("status") == "resolved" and r.get("amountPln") is not None
    ]
    total_spend = sum(float(r["amountPln"]) for r in signed_core)

    cat_keys = ["software_deploy", "hardware_lab", "training", "consulting"]
    cats = {}
    for ck in cat_keys:
        c_proc = [r for r in core if r.get("category") == ck]
        c_signed = [r for r in signed_core if r.get("category") == ck]
        c_sum = sum(float(r["amountPln"]) for r in c_signed)
        cats[ck] = {
            "proc_count": len(c_proc),
            "signed_count": len(c_signed),
            "sum_pln": c_sum,
            "proc_pct": (len(c_proc) / len(core) * 100.0) if core else 0.0,
            "spend_pct": (c_sum / total_spend * 100.0) if total_spend > 0 else 0.0,
        }

    tech_sum = cats["software_deploy"]["sum_pln"] + cats["hardware_lab"]["sum_pln"]
    tech_pct = (tech_sum / total_spend * 100.0) if total_spend > 0 else 0.0

    soft_signed = [r for r in signed_core if r.get("category") == "software_deploy"]
    soft_with_bids = [r for r in soft_signed if r.get("bids") is not None]
    soft_single = [r for r in soft_with_bids if r.get("bids") == 1]
    soft_single_pct = (
        len(soft_single) / len(soft_with_bids) * 100.0
        if soft_with_bids else 0.0
    )

    dates = sorted(r.get("date", "") for r in records if r.get("date"))
    min_ym = dates[0][:7] if dates else "2024-01"
    max_ym = dates[-1][:7] if dates else "2026-11"
    span_label = f"{min_ym[5:7]}.{min_ym[:4]}–{max_ym[5:7]}.{max_ym[:4]}"

    return {
        "total_proc": total_proc,
        "core_proc": len(core),
        "signed_count": len(signed_core),
        "total_spend": total_spend,
        "tech_sum": tech_sum,
        "tech_pct": tech_pct,
        "soft_single_num": len(soft_single),
        "soft_single_den": len(soft_with_bids),
        "soft_single_pct": soft_single_pct,
        "cats": cats,
        "span_label": span_label,
    }


def fmt_num(val: float, decimals: int, lang: str) -> str:
    s = f"{val:.{decimals}f}"
    return s.replace(".", ",") if lang == "pl" else s


def fmt_millions(pln: float, lang: str) -> str:
    m = pln / 1_000_000.0
    if lang == "pl":
        return f"{m:.2f}".replace(".", ",") + " mln zł"
    return f"{m:.2f}M PLN"


def s(v: float) -> int:
    return int(round(v * SCALE))


def text_w(draw: ImageDraw.ImageDraw, txt: str, font: ImageFont.FreeTypeFont) -> float:
    bbox = draw.textbbox((0, 0), txt, font=font)
    return (bbox[2] - bbox[0]) / SCALE


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


def render_card(stats: dict, lang: str, out_path: Path) -> None:
    img = Image.new("RGB", (W * SCALE, H * SCALE), BG)
    draw = ImageDraw.Draw(img)

    # Fit headline size cleanly within content frame (1092px)
    x0, x1 = 54, W - 54
    max_h1_w = x1 - x0 - 10
    headline_px = 51.0 if lang == "pl" else 49.0
    fonts = load_fonts(headline_px)

    for attempt_px in [headline_px, 49.0, 47.0, 45.0, 43.0]:
        fonts = load_fonts(attempt_px)
        if lang == "pl":
            h1_lines = [
                [
                    ("Na co polskie instytucje ", fonts["h1_reg"], INK),
                    ("naprawdę", fonts["h1_ital"], RUST),
                    (" wydają", fonts["h1_reg"], INK),
                ],
                [
                    ("pieniądze pod hasłem AI?", fonts["h1_reg"], INK),
                ],
            ]
        else:
            h1_lines = [
                [
                    ("What do Polish public institutions ", fonts["h1_reg"], INK),
                    ("actually", fonts["h1_ital"], RUST),
                ],
                [
                    ("buy under the ‘AI’ label?", fonts["h1_reg"], INK),
                ],
            ]
        widest = max(
            sum(text_w(draw, t, fnt) for t, fnt, _ in line)
            for line in h1_lines
        )
        if widest <= max_h1_w:
            break

    # 1. Outer paper frame + top signature rule
    draw.rectangle(
        [s(18), s(18), s(W - 18), s(H - 18)],
        outline=RULE,
        width=s(1),
    )
    draw.rectangle([s(x0), s(42), s(x1), s(44)], fill=INK)

    # 2. Top metadata bar
    if lang == "pl":
        eyebrow_left = "NR 01 · RAPORT I BAZA DANYCH BZP (2024–2026)"
        eyebrow_right = f"{stats['total_proc']} POSTĘPOWAŃ · {stats['signed_count']} PODPISANYCH UMÓW"
    else:
        eyebrow_left = "ISSUE 01 · BZP REPORT & OPEN DATASET (2024–2026)"
        eyebrow_right = f"{stats['total_proc']} PROCEEDINGS · {stats['signed_count']} SIGNED CONTRACTS"

    draw.text((s(x0), s(55)), eyebrow_left, font=fonts["mono_md_b"], fill=RUST)
    rw = text_w(draw, eyebrow_right, fonts["mono_md"])
    draw.text((s(x1 - rw), s(55.5)), eyebrow_right, font=fonts["mono_md"], fill=MUTED)
    draw.line([(s(x0), s(82)), (s(x1), s(82))], fill=RULE, width=s(1))

    # 3. Serif editorial headline
    draw_runs(draw, x0, 95, h1_lines[0])
    draw_runs(draw, x0, 155, h1_lines[1])

    # 4. Data Zone (y = 234 .. 540): Left 3 KPI Cards + Right Paired Bar Figure
    zone_top = 234
    zone_bot = 540
    left_x0, left_x1 = x0, 524  # 470px wide
    right_x0, right_x1 = 544, x1  # 602px wide

    total_m = fmt_num(stats["total_spend"] / 1_000_000.0, 2, lang)
    tech_pct_s = fmt_num(stats["tech_pct"], 1, lang)
    single_pct_s = fmt_num(stats["soft_single_pct"], 1, lang)
    train_proc_pct_s = fmt_num(stats["cats"]["training"]["proc_pct"], 1, lang)
    train_pct_s = fmt_num(stats["cats"]["training"]["spend_pct"], 1, lang)

    if lang == "pl":
        kpis = [
            {
                "num": total_m,
                "unit": "mln zł",
                "accent": INK,
                "tag": "WARTOŚĆ UMÓW PODSTAWOWYCH",
                "l1": f"w {stats['signed_count']} podpisanych kontraktach brutto",
                "l2": f"({stats['core_proc']} postępowań po odsianiu remontów)",
            },
            {
                "num": tech_pct_s,
                "unit": "%",
                "accent": INK,
                "tag": "WDROŻENIA IT I SPRZĘT LAB.",
                "l1": f"{fmt_millions(stats['tech_sum'], 'pl')} trafia na systemy i GPU",
                "l2": f"(szkolenia: {train_proc_pct_s}% ogłoszeń, {train_pct_s}% kwoty)",
            },
            {
                "num": single_pct_s,
                "unit": "%",
                "accent": RUST,
                "tag": "WDROŻENIA Z JEDNĄ OFERTĄ",
                "l1": f"{stats['soft_single_num']} z {stats['soft_single_den']} umów na systemy AI bez wyboru",
                "l2": "cenowego (mediana w IT: 1 oferta)",
            },
        ]
    else:
        kpis = [
            {
                "num": total_m,
                "unit": "M PLN",
                "accent": INK,
                "tag": "SIGNED CORE CONTRACTS",
                "l1": f"across {stats['signed_count']} awarded contracts gross",
                "l2": f"({stats['core_proc']} core tenders, renovations excluded)",
            },
            {
                "num": tech_pct_s,
                "unit": "%",
                "accent": INK,
                "tag": "SOFTWARE & LAB HARDWARE",
                "l1": f"{fmt_millions(stats['tech_sum'], 'en')} goes to systems & GPUs",
                "l2": f"(workshops: {train_proc_pct_s}% of notices, {train_pct_s}% of value)",
            },
            {
                "num": single_pct_s,
                "unit": "%",
                "accent": RUST,
                "tag": "SINGLE-BID IT DEPLOYMENTS",
                "l1": f"{stats['soft_single_num']} of {stats['soft_single_den']} AI software contracts",
                "l2": "attracted zero competing bids",
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

        # Left number block inside KPI tile
        num_x = left_x0 + 18
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

        # Divider between KPI value and explanation
        div_x = left_x0 + 182
        draw.line(
            [(s(div_x), s(cy0 + 15)), (s(div_x), s(cy1 - 15))],
            fill=RULE_SOFT,
            width=s(1),
        )

        tx = div_x + 15
        draw.text((s(tx), s(cy0 + 14)), kpi["tag"], font=fonts["mono_sm_b"], fill=RUST)
        draw.text((s(tx), s(cy0 + 35)), kpi["l1"], font=fonts["sans_reg"], fill=BODY)
        draw.text((s(tx), s(cy0 + 54)), kpi["l2"], font=fonts["sans_reg"], fill=MUTED)

    # 5. Right Panel: Paired Bar Chart (Notices Share vs Contract Value Share)
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

    px = right_x0 + 22
    pr = right_x1 - 22
    if lang == "pl":
        fig_kicker = "STRUKTURA ZAMÓWIEŃ · OGŁOSZENIA VS ZAKONTRAKTOWANE ZŁOTÓWKI"
        leg_proc = "Udział w ogłoszeniach (%)"
        leg_spend = "Udział w kwocie umów (%)"
        cat_labels = [
            ("software_deploy", "Wdrożenia i systemy AI"),
            ("hardware_lab", "Sprzęt GPU i laboratoria"),
            ("training", "Szkolenia i warsztaty"),
            ("consulting", "Badania i audyty"),
        ]
    else:
        fig_kicker = "CONTRACT STRUCTURE · SHARE OF NOTICES VS CONTRACT VALUE"
        leg_proc = "Share of notices (%)"
        leg_spend = "Share of contract value (%)"
        cat_labels = [
            ("software_deploy", "AI software & systems"),
            ("hardware_lab", "GPU & lab hardware"),
            ("training", "Trainings & workshops"),
            ("consulting", "Research & audits"),
        ]

    draw.text((s(px), s(zone_top + 14)), fig_kicker, font=fonts["mono_sm_b"], fill=RUST)

    # Legend row
    leg_y = zone_top + 36
    draw.rectangle([s(px), s(leg_y + 2), s(px + 10), s(leg_y + 12)], fill=BAR_PROC, outline=INK, width=1)
    draw.text((s(px + 16), s(leg_y)), leg_proc, font=fonts["mono_sm"], fill=BODY)
    leg2_x = px + 16 + text_w(draw, leg_proc, fonts["mono_sm"]) + 24
    draw.rectangle([s(leg2_x), s(leg_y + 2), s(leg2_x + 10), s(leg_y + 12)], fill=RUST, outline=INK, width=1)
    draw.text((s(leg2_x + 16), s(leg_y)), leg_spend, font=fonts["mono_sm"], fill=BODY)

    draw.line([(s(px), s(zone_top + 58)), (s(pr), s(zone_top + 58))], fill=RULE_SOFT, width=s(1))

    # 4 Category rows
    rows_top = zone_top + 68
    row_h = 57.5
    bar_x0 = right_x0 + 218
    bar_x1 = pr - 58
    bar_max_w = bar_x1 - bar_x0
    scale_max_pct = max(
        55.0,
        max(
            max(c["proc_pct"], c["spend_pct"])
            for c in stats["cats"].values()
        ) * 1.06,
    )

    for idx, (ck, cname) in enumerate(cat_labels):
        c = stats["cats"][ck]
        ry = rows_top + idx * row_h

        if idx > 0:
            draw.line(
                [(s(px), s(ry - 6)), (s(pr), s(ry - 6))],
                fill=RULE_SOFT,
                width=s(1),
            )

        # Category title + subline
        draw.text((s(px), s(ry + 2)), cname, font=fonts["sans_bold"], fill=INK)
        sub_txt = (
            f"{c['proc_count']} post. · {fmt_millions(c['sum_pln'], 'pl')}"
            if lang == "pl"
            else f"{c['proc_count']} proc. · {fmt_millions(c['sum_pln'], 'en')}"
        )
        draw.text((s(px), s(ry + 23)), sub_txt, font=fonts["mono_sm"], fill=MUTED)

        # Bar 1: Share of notices
        b1_y = ry + 6
        b_h = 10
        draw.rectangle(
            [s(bar_x0), s(b1_y), s(bar_x1), s(b1_y + b_h)],
            fill=PALE,
            outline=TRACK_BORDER,
            width=s(1),
        )
        w1 = max(3.0, (c["proc_pct"] / scale_max_pct) * bar_max_w)
        draw.rectangle(
            [s(bar_x0), s(b1_y), s(bar_x0 + w1), s(b1_y + b_h)],
            fill=BAR_PROC,
        )
        pct1_txt = fmt_num(c["proc_pct"], 1, lang) + "%"
        p1_w = text_w(draw, pct1_txt, fonts["mono_sm"])
        draw.text((s(pr - p1_w), s(b1_y - 2)), pct1_txt, font=fonts["mono_sm"], fill=MUTED)

        # Bar 2: Share of contract value
        b2_y = ry + 23
        draw.rectangle(
            [s(bar_x0), s(b2_y), s(bar_x1), s(b2_y + b_h)],
            fill=PALE,
            outline=TRACK_BORDER,
            width=s(1),
        )
        w2 = max(3.0, (c["spend_pct"] / scale_max_pct) * bar_max_w)
        draw.rectangle(
            [s(bar_x0), s(b2_y), s(bar_x0 + w2), s(b2_y + b_h)],
            fill=RUST,
        )
        pct2_txt = fmt_num(c["spend_pct"], 1, lang) + "%"
        p2_w = text_w(draw, pct2_txt, fonts["mono_sm_b"])
        draw.text((s(pr - p2_w), s(b2_y - 2)), pct2_txt, font=fonts["mono_sm_b"], fill=RUST)

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
        f"dane: ezamowienia.gov.pl ({stats['span_label']})"
        if lang == "pl"
        else f"data: ezamowienia.gov.pl ({stats['span_label']})"
    )
    fr_w = text_w(draw, foot_right, fonts["mono_md"])
    draw.text((s(x1 - fr_w), s(foot_y)), foot_right, font=fonts["mono_md"], fill=MUTED)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    final_img = img.resize((W, H), Image.Resampling.LANCZOS)
    final_img.save(out_path, format="PNG", optimize=True)


def main() -> None:
    with DATA_PATH.open(encoding="utf-8") as f:
        records = json.load(f)
    stats = compute_stats(records)
    render_card(stats, "pl", OUT_PL)
    render_card(stats, "en", OUT_EN)
    print(
        f"Generated {OUT_PL.relative_to(ROOT)} and {OUT_EN.relative_to(ROOT)} "
        f"({W}x{H} px) from {stats['total_proc']} records / {stats['signed_count']} signed core contracts."
    )


if __name__ == "__main__":
    main()
