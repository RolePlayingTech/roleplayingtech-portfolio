#!/usr/bin/env python3
"""Build cleaned, verified master dataset for RolePlayingTech Lab Issue 04.

Produces `assets/lab/pse-grid-2026.json` from primary 15-minute PSE API v2
telemetry (`poze-redoze`, `his-wlk-cal`, `rce-pln`, `energy-prices`,
`przeplywy-mocy`, `pwm-rdn-rdb`, and `gen-jw`) after applying all Phase C
methodology & zero-fill audit rules:
  1. Continuous 73,924 15-minute intervals (`2024-09-24` .. `2026-11-02`,
     770 calendar days including 3 autumn 100-q and 2 spring 92-q DST days).
  2. Apples-to-apples YTD comparison (`01.01–02.11.2025` vs `01.01–02.11.2026`,
     29,376 quarters each).
  3. Full-hour (`:00`) curtailment guillotine jump distribution across
     thresholds (`>=100`, `>=200`, `>=300`, `>=500 MW`).
  4. Triple compensation valuation (`max(0, RCE)`, `max(0, CSDAC)`, statutory
     `max(0, CEN)` $K^C$) juxtaposed with official PSE cash payouts.
  5. Unit-level `gen-jw` decomposition (`37` plants / `106` units) reindexed
     with `fill_value=0.0` across all `864` quarters of the 9 representative
     expensive-curtailment weekdays, plus 96-quarter 15-min showcase days.
  6. Cross-border physical vs commercial (`RDN+RDB`) vs unscheduled loop flows
     (`2026 YTD` only, where `pwm-rdn-rdb` has 100% coverage).
  7. Dynamic net-billing (`RCE`) prosumer price scissors with statutory
     `1.23` deposit multiplier context (`Dz.U. 2024 poz. 1847`).

Usage:
    py -X utf8 scripts/build_pse_grid_dataset.py [--raw-root <scratch-dir>]
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = REPO_ROOT / "assets" / "lab" / "pse-grid-2026.json"
DEFAULT_SCRATCH = Path(os.environ.get("RAW_AUDIT_DIR", str(REPO_ROOT / "scratch")))


LIGNITE_PLANTS = {"Bełchatów", "Turów", "Pątnów 2", "Pątnów 1", "Konin"}
HARD_COAL_PLANTS = {
    "Opole",
    "Kozienice 1",
    "Kozienice 2",
    "Jaworzno 3",
    "Jaworzno 2 JWCD",
    "Połaniec",
    "Połaniec 2-Pasywna",
    "Łaziska 3",
    "Rybnik",
    "Łagisza",
    "Ostrołęka B",
    "Dolna Odra",
    "Siersza",
    "Skawina",
}
GAS_CCGT_PLANTS = {
    "Gryfino",
    "Płock",
    "EC Włocławek",
    "EC Stalowa Wola",
    "EC Wrotków",
    "EC Żerań 2",
    "EC Czechnica-2",
    "Zielona Góra",
    "EC Gorzów",
    "EC Toruń",
}
ESP_PLANTS = {"Żarnowiec", "Porąbka Żar", "Solina", "Czorsztyn", "Dychów", "Żydowo"}
RES_JW_PLANTS = {"Zwartowo", "MFW Baltic Power"}

PLANT_OWNER_MAP = {
    "Bełchatów": ("PGE GiEK S.A.", "Łódzkie"),
    "Turów": ("PGE GiEK S.A.", "Dolnośląskie"),
    "Opole": ("PGE GiEK S.A.", "Opolskie"),
    "Gryfino": ("PGE Gryfino 2050 Sp. z o.o.", "Zachodniopomorskie"),
    "Dolna Odra": ("PGE GiEK S.A.", "Zachodniopomorskie"),
    "Rybnik": ("PGE GiEK S.A.", "Śląskie"),
    "Kozienice 1": ("Enea Wytwarzanie Sp. z o.o.", "Mazowieckie"),
    "Kozienice 2": ("Enea Wytwarzanie Sp. z o.o.", "Mazowieckie"),
    "Połaniec": ("Enea Elektrownia Połaniec S.A.", "Świętokrzyskie"),
    "Połaniec 2-Pasywna": ("Enea Elektrownia Połaniec S.A.", "Świętokrzyskie"),
    "Jaworzno 3": ("TAURON Wytwarzanie S.A.", "Śląskie"),
    "Jaworzno 2 JWCD": ("TAURON Nowe Jaworzno Grupa TAURON", "Śląskie"),
    "Łaziska 3": ("TAURON Wytwarzanie S.A.", "Śląskie"),
    "Łagisza": ("TAURON Wytwarzanie S.A.", "Śląskie"),
    "Siersza": ("TAURON Wytwarzanie S.A.", "Małopolskie"),
    "EC Stalowa Wola": ("EC Stalowa Wola S.A. (TAURON/PGNiG)", "Podkarpackie"),
    "Pątnów 2": ("ZE PAK S.A.", "Wielkopolskie"),
    "Pątnów 1": ("ZE PAK S.A.", "Wielkopolskie"),
    "Konin": ("ZE PAK S.A.", "Wielkopolskie"),
    "Płock": ("ORLEN S.A.", "Mazowieckie"),
    "EC Włocławek": ("ORLEN S.A.", "Kujawsko-Pomorskie"),
    "Ostrołęka B": ("Energa Elektrownie Ostrołęka S.A. (ORLEN)", "Mazowieckie"),
    "EC Żerań 2": ("ORLEN Termika S.A.", "Mazowieckie"),
    "EC Siekierki": ("ORLEN Termika S.A.", "Mazowieckie"),
    "Siekierki": ("ORLEN Termika S.A.", "Mazowieckie"),
    "EC Wrotków": ("PGE Energia Ciepła S.A.", "Lubelskie"),
    "EC Czechnica-2": ("Kogeneracja S.A. (PGE)", "Dolnośląskie"),
    "Wrocław": ("Kogeneracja S.A. (PGE)", "Dolnośląskie"),
    "Kraków Łęg": ("PGE Energia Ciepła S.A.", "Małopolskie"),
    "Kraków": ("PGE Energia Ciepła S.A.", "Małopolskie"),
    "Zielona Góra": ("EC Zielona Góra S.A. (PGE)", "Lubuskie"),
    "EC Gorzów": ("PGE Energia Ciepła S.A.", "Lubuskie"),
    "EC Toruń": ("PGE Toruń S.A.", "Kujawsko-Pomorskie"),
    "EC Rzeszów": ("PGE Energia Ciepła S.A.", "Podkarpackie"),
    "Rzeszów": ("PGE Energia Ciepła S.A.", "Podkarpackie"),
    "Skawina": ("CEZ Skawina S.A.", "Małopolskie"),
    "Chorzów": ("CEZ Chorzów S.A.", "Śląskie"),
    "Karolin 2": ("Veolia Energia Poznań S.A.", "Wielkopolskie"),
    "EC Łódź-4": ("Veolia Energia Łódź S.A.", "Łódzkie"),
    "Łódź-4": ("Veolia Energia Łódź S.A.", "Łódzkie"),
    "Katowice": ("TAURON Ciepło Sp. z o.o.", "Śląskie"),
    "Żarnowiec": ("PGE Energia Odnawialna S.A.", "Pomorskie"),
    "Porąbka Żar": ("PGE Energia Odnawialna S.A.", "Śląskie"),
    "Solina": ("PGE Energia Odnawialna S.A.", "Podkarpackie"),
    "Dychów": ("PGE Energia Odnawialna S.A.", "Lubuskie"),
    "Czorsztyn": ("Zespół Elektrowni Wodnych Niedzica S.A.", "Małopolskie"),
    "Żydowo": ("Energa Wytwarzanie S.A.", "Zachodniopomorskie"),
    "Zwartowo": ("Stigma / Respect Energy (PV)", "Pomorskie"),
    "MFW Baltic Power": ("Baltic Power (ORLEN / Northland Power)", "Pomorskie (Bałtyk)"),
}


def classify_plant(plant: str) -> str:
    if plant in LIGNITE_PLANTS:
        return "lignite"
    if plant in HARD_COAL_PLANTS:
        return "hard_coal"
    if plant in GAS_CCGT_PLANTS:
        return "gas_ccgt"
    if plant in ESP_PLANTS:
        return "pumped_storage"
    if plant in RES_JW_PLANTS:
        return "res_jw"
    return "chp_coal_bio"


def r1(v: float) -> float:
    return round(float(v), 1)


def r2(v: float) -> float:
    return round(float(v), 2)


def compute_period_metrics(sub: pd.DataFrame) -> dict[str, Any]:
    curt = sub[sub["tot_curt_mw"] > 0]
    tot_gwh = float(sub["tot_curt_mwh"].sum() / 1000.0)
    pv_gwh = float(sub["pv_curt_mw"].sum() * 0.25 / 1000.0)
    wi_gwh = float(sub["wi_curt_mw"].sum() * 0.25 / 1000.0)
    bal_gwh = float((sub["pv_red_balance_mw"].abs() + sub["wi_red_balance_mw"].abs()).sum() * 0.25 / 1000.0)
    net_gwh = float((sub["pv_red_network_mw"].abs() + sub["wi_red_network_mw"].abs()).sum() * 0.25 / 1000.0)

    wkd_gwh = float(sub.loc[~sub["is_weekend"], "tot_curt_mwh"].sum() / 1000.0)
    pos_rce = curt[curt["rce_pln"] > 0]
    le0_rce = curt[curt["rce_pln"] <= 0]
    lt0_rce = curt[curt["rce_pln"] < 0]
    ge100_rce = curt[curt["rce_pln"] >= 100]
    ge250_rce = curt[curt["rce_pln"] >= 250]
    ge400_rce = curt[curt["rce_pln"] >= 400]
    ge250_cen = curt[curt["cen_cost"] >= 250]
    ge400_cen = curt[curt["cen_cost"] >= 400]

    rce_net_mln = float((sub["tot_curt_mwh"] * sub["rce_pln"]).sum() / 1e6)
    rce_max0_mln = float((sub["tot_curt_mwh"] * sub["rce_pln"].clip(lower=0)).sum() / 1e6)
    csdac_max0_mln = float((sub["tot_curt_mwh"] * sub["csdac_best"].clip(lower=0)).sum() / 1e6)
    cen_max0_mln = float((sub["tot_curt_mwh"] * sub["cen_cost"].clip(lower=0)).sum() / 1e6)
    cen_cap1500_mln = float((sub["tot_curt_mwh"] * sub["cen_cost"].clip(lower=0, upper=1500)).sum() / 1e6)

    return {
        "quartersTotal": int(len(sub)),
        "quartersCurtailed": int(len(curt)),
        "hoursCurtailed": r2(len(curt) * 0.25),
        "curtailedGwh": r2(tot_gwh),
        "pvCurtailedGwh": r2(pv_gwh),
        "windCurtailedGwh": r2(wi_gwh),
        "balanceCurtailedGwh": r2(bal_gwh),
        "networkCurtailedGwh": r2(net_gwh),
        "balanceSharePct": r2(bal_gwh / tot_gwh * 100.0) if tot_gwh else 0.0,
        "networkSharePct": r2(net_gwh / tot_gwh * 100.0) if tot_gwh else 0.0,
        "weekdayCurtailedGwh": r2(wkd_gwh),
        "weekdaySharePct": r2(wkd_gwh / tot_gwh * 100.0) if tot_gwh else 0.0,
        "rcePositiveGwh": r2(pos_rce["tot_curt_mwh"].sum() / 1000.0),
        "rcePositiveSharePct": r2(pos_rce["tot_curt_mwh"].sum() / (tot_gwh * 1000.0) * 100.0),
        "rcePositiveQuarters": int(len(pos_rce)),
        "rceNonPositiveGwh": r2(le0_rce["tot_curt_mwh"].sum() / 1000.0),
        "rceNonPositiveSharePct": r2(le0_rce["tot_curt_mwh"].sum() / (tot_gwh * 1000.0) * 100.0),
        "rceNonPositiveQuarters": int(len(le0_rce)),
        "rceStrictNegGwh": r2(lt0_rce["tot_curt_mwh"].sum() / 1000.0),
        "rceStrictNegQuarters": int(len(lt0_rce)),
        "rceGe100Gwh": r2(ge100_rce["tot_curt_mwh"].sum() / 1000.0),
        "rceGe100SharePct": r2(ge100_rce["tot_curt_mwh"].sum() / (tot_gwh * 1000.0) * 100.0),
        "rceGe250Gwh": r2(ge250_rce["tot_curt_mwh"].sum() / 1000.0),
        "rceGe250SharePct": r2(ge250_rce["tot_curt_mwh"].sum() / (tot_gwh * 1000.0) * 100.0),
        "rceGe250Quarters": int(len(ge250_rce)),
        "rceGe250Hours": r2(len(ge250_rce) * 0.25),
        "rceGe400Gwh": r2(ge400_rce["tot_curt_mwh"].sum() / 1000.0),
        "rceGe400SharePct": r2(ge400_rce["tot_curt_mwh"].sum() / (tot_gwh * 1000.0) * 100.0),
        "rceGe400Quarters": int(len(ge400_rce)),
        "cenGe250Gwh": r2(ge250_cen["tot_curt_mwh"].sum() / 1000.0),
        "cenGe250SharePct": r2(ge250_cen["tot_curt_mwh"].sum() / (tot_gwh * 1000.0) * 100.0),
        "cenGe400Gwh": r2(ge400_cen["tot_curt_mwh"].sum() / 1000.0),
        "cenGe400SharePct": r2(ge400_cen["tot_curt_mwh"].sum() / (tot_gwh * 1000.0) * 100.0),
        "valRceNetMln": r2(rce_net_mln),
        "valRceMax0Mln": r2(rce_max0_mln),
        "valCsdacMax0Mln": r2(csdac_max0_mln),
        "valCenMax0Mln": r2(cen_max0_mln),
        "valCenCap1500Mln": r2(cen_cap1500_mln),
        "weightedRcePln": r2(rce_net_mln * 1e6 / (tot_gwh * 1000.0)) if tot_gwh else 0.0,
        "weightedCenMax0Pln": r2(cen_max0_mln * 1e6 / (tot_gwh * 1000.0)) if tot_gwh else 0.0,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-root", type=Path, default=DEFAULT_SCRATCH)
    args = parser.parse_args()

    raw_root: Path = args.raw_root
    exp04_dir = raw_root / "phase_a" / "exp_04"
    b4_dir = raw_root / "phase_b" / "b4_pse_grid"

    master_full = pd.read_csv(exp04_dir / "pse_master_15m_2024_2026.csv")
    borders_25_26 = pd.read_csv(b4_dir / "pse_borders_cen_15m_2025_2026.csv")
    raw_ep = pd.read_csv(b4_dir / "raw_energy_prices_2024_2026.csv")

    master_full["ts_dt"] = pd.to_datetime(master_full["ts_utc"], utc=True)
    raw_ep["ts_dt"] = pd.to_datetime(raw_ep["dtime_utc"], format="mixed", utc=True)
    raw_ep = raw_ep.drop_duplicates("ts_dt", keep="last")

    # Join full 73,924-row series (2024-09-24 .. 2026-11-02) with cen_cost & balance
    df = master_full.merge(
        raw_ep[["ts_dt", "cen_cost", "balance", "csdac_pln"]].rename(columns={"csdac_pln": "ep_csdac"}),
        on="ts_dt",
        how="left",
    )
    df["csdac_best"] = df["csdac_pln"].fillna(df["ep_csdac"])
    df["pv_curt_mw"] = df["pv_red_balance_mw"].abs() + df["pv_red_network_mw"].abs()
    df["wi_curt_mw"] = df["wi_red_balance_mw"].abs() + df["wi_red_network_mw"].abs()
    df = df.sort_values("ts_dt").reset_index(drop=True)

    # Merge border columns from borders_25_26 on ts_dt
    borders_25_26["ts_dt"] = pd.to_datetime(borders_25_26["ts_utc"], utc=True)
    border_cols = [
        c for c in borders_25_26.columns
        if c.startswith(("phys_net_", "sched_net_", "loop_net_"))
    ]
    df = df.merge(borders_25_26[["ts_dt"] + border_cols], on="ts_dt", how="left")

    assert len(df) == 73924, f"Expected 73,924 intervals, got {len(df)}"
    assert df["ts_dt"].is_unique, "Duplicate UTC timestamps found!"
    assert df["cen_cost"].isna().sum() == 0, "Missing cen_cost values!"

    p_2024_q4 = compute_period_metrics(df[df["business_date"] <= "2024-12-31"])
    p_2025_full = compute_period_metrics(df[(df["business_date"] >= "2025-01-01") & (df["business_date"] <= "2025-12-31")])
    p_2025_ytd = compute_period_metrics(df[(df["business_date"] >= "2025-01-01") & (df["business_date"] <= "2025-11-02")])
    p_2026_ytd = compute_period_metrics(df[(df["business_date"] >= "2026-01-01") & (df["business_date"] <= "2026-11-02")])

    # Sanity-check headline invariants from Phase C audit
    assert p_2026_ytd["curtailedGwh"] == 1805.05, p_2026_ytd["curtailedGwh"]
    assert p_2025_ytd["curtailedGwh"] == 1326.29, p_2025_ytd["curtailedGwh"]
    assert p_2026_ytd["rcePositiveSharePct"] == 66.57
    assert p_2026_ytd["rceGe250Gwh"] == 497.42
    assert p_2026_ytd["valRceMax0Mln"] == 251.46
    assert p_2026_ytd["valCenMax0Mln"] == 355.09

    # 1. Monthly series 2025-01 .. 2026-10 (22 full months + Nov 1-2 note)
    df_25_26 = df[df["business_date"] >= "2025-01-01"].copy()
    df_25_26["ym"] = df_25_26["business_date"].str.slice(0, 7)
    monthly_series = []
    for ym, grp in df_25_26[df_25_26["ym"] <= "2026-10"].groupby("ym"):
        tot = float(grp["tot_curt_mwh"].sum() / 1000.0)
        le0 = float(grp.loc[grp["rce_pln"] <= 0, "tot_curt_mwh"].sum() / 1000.0)
        mid = float(grp.loc[(grp["rce_pln"] > 0) & (grp["rce_pln"] < 250), "tot_curt_mwh"].sum() / 1000.0)
        ge250 = float(grp.loc[grp["rce_pln"] >= 250, "tot_curt_mwh"].sum() / 1000.0)
        rce_m = float((grp["tot_curt_mwh"] * grp["rce_pln"].clip(lower=0)).sum() / 1e6)
        cen_m = float((grp["tot_curt_mwh"] * grp["cen_cost"].clip(lower=0)).sum() / 1e6)
        monthly_series.append({
            "ym": ym,
            "totalGwh": r2(tot),
            "rceLe0Gwh": r2(le0),
            "rce0To250Gwh": r2(mid),
            "rceGe250Gwh": r2(ge250),
            "rceGe250Pct": r1(ge250 / tot * 100.0) if tot > 0 else 0.0,
            "valRceMln": r2(rce_m),
            "valCenMln": r2(cen_m),
        })

    # 2. CEN brackets in 2026 YTD
    d26_curt = df[(df["business_date"] >= "2026-01-01") & (df["tot_curt_mw"] > 0)].copy()
    cen_brackets = []
    bracket_defs = [
        ("le0", "CEN ≤ 0 zł/MWh", "CEN ≤ 0 PLN/MWh", d26_curt["cen_cost"] <= 0),
        ("b0_250", "0 < CEN < 250 zł", "0 < CEN < 250 PLN", (d26_curt["cen_cost"] > 0) & (d26_curt["cen_cost"] < 250)),
        ("b250_400", "250 ≤ CEN < 400 zł", "250 ≤ CEN < 400 PLN", (d26_curt["cen_cost"] >= 250) & (d26_curt["cen_cost"] < 400)),
        ("b400_600", "400 ≤ CEN ≤ 600 zł", "400 ≤ CEN ≤ 600 PLN", (d26_curt["cen_cost"] >= 400) & (d26_curt["cen_cost"] <= 600)),
        ("gt600", "CEN > 600 zł/MWh", "CEN > 600 PLN/MWh", d26_curt["cen_cost"] > 600),
    ]
    for code, lbl_pl, lbl_en, msk in bracket_defs:
        sub = d26_curt[msk]
        gwh = float(sub["tot_curt_mwh"].sum() / 1000.0)
        kc = float((sub["tot_curt_mwh"] * sub["cen_cost"].clip(lower=0)).sum() / 1e6)
        cen_brackets.append({
            "code": code,
            "labelPl": lbl_pl,
            "labelEn": lbl_en,
            "quarters": int(len(sub)),
            "gwh": r2(gwh),
            "sharePct": r2(gwh / 1805.0526 * 100.0),
            "kcMlnPln": r2(kc),
            "meanBalanceMw": r1(sub["balance"].mean()) if len(sub) else 0.0,
        })

    # 3. Full-hour (:00) guillotine jumps (ts_dt is period-end UTC -> minute==15 is :00..:15 start of hour)
    df_25_26 = df_25_26.sort_values("ts_dt").reset_index(drop=True)
    df_25_26["abs_delta_curt"] = df_25_26["tot_curt_mw"].diff().abs()
    # Map period-end minute (15, 30, 45, 0) -> interval start minute (:00, :15, :30, :45)
    end_min_to_start = {15: "00", 30: "15", 45: "30", 0: "45"}
    df_25_26["start_min"] = df_25_26["ts_dt"].dt.minute.map(end_min_to_start)

    def calc_guillotine(sub_df: pd.DataFrame) -> dict[str, Any]:
        out = {}
        for thr in (100, 200, 300, 500):
            jumps = sub_df[sub_df["abs_delta_curt"] >= thr]
            vc = jumps["start_min"].value_counts()
            n_tot = int(len(jumps))
            n_00 = int(vc.get("00", 0))
            n_15 = int(vc.get("15", 0))
            n_30 = int(vc.get("30", 0))
            n_45 = int(vc.get("45", 0))
            out[f"ge{thr}"] = {
                "thresholdMw": thr,
                "totalJumps": n_tot,
                "at00": n_00,
                "at15": n_15,
                "at30": n_30,
                "at45": n_45,
                "at00Pct": r2(n_00 / n_tot * 100.0) if n_tot else 0.0,
            }
        return out

    guillotine_25_26 = calc_guillotine(df_25_26)
    guillotine_2026 = calc_guillotine(df_25_26[df_25_26["business_date"] >= "2026-01-01"])
    assert guillotine_25_26["ge200"]["at00"] == 2263 and guillotine_25_26["ge200"]["totalJumps"] == 2339
    assert guillotine_25_26["ge200"]["at15"] == 23 and guillotine_25_26["ge200"]["at30"] == 31 and guillotine_25_26["ge200"]["at45"] == 22
    assert guillotine_25_26["ge500"]["at00Pct"] == 100.0

    # 4. Unit-level gen-jw (zero-filled across all 864 quarters of the 9 curtailment weekdays)
    gen_jw = pd.read_csv(b4_dir / "pse_gen_jw_sample_days_2026.csv")
    gen_jw["ts_dt"] = pd.to_datetime(gen_jw["dtime_utc"], format="mixed", utc=True)
    if "publication_ts_utc" in gen_jw.columns:
        gen_jw = gen_jw.sort_values("publication_ts_utc").drop_duplicates(
            ["ts_dt", "resource_code", "operating_mode"], keep="last"
        )
    gen_jw["tech_group"] = gen_jw["power_plant"].map(classify_plant)

    all_plants = sorted(gen_jw["power_plant"].unique())
    plant_total_units = (
        gen_jw.groupby("power_plant")["resource_code"].nunique().to_dict()
    )

    curt_9_days = sorted([
        d for d in gen_jw["business_date"].unique()
        if d not in ("2026-07-15", "2026-09-10")
    ])
    sys_9 = df[df["business_date"].isin(curt_9_days)][
        ["business_date", "ts_dt", "period", "hour", "demand", "jg", "pv", "wi", "jgm", "tot_curt_mw", "rce_pln", "csdac_best", "cen_cost", "phys_net_DE", "phys_net_ALL"]
    ].copy()
    assert len(sys_9) == 864, f"Expected 864 quarters for 9 days, got {len(sys_9)}"

    # Generation-only zero-filled grid (864 timestamps x 37 plants)
    g9_gen = gen_jw[(gen_jw["business_date"].isin(curt_9_days)) & (gen_jw["operating_mode"] == "Generacja")].copy()
    p_raw = g9_gen.groupby(["ts_dt", "power_plant"]).agg(
        gen_mw=("value", "sum"),
        spinning_units=("value", lambda s: int((s > 5.0).sum())),
    )
    full_idx = pd.MultiIndex.from_product([sys_9["ts_dt"].tolist(), all_plants], names=["ts_dt", "power_plant"])
    p_grid = p_raw.reindex(full_idx, fill_value=0.0).reset_index()

    # Also add Pobór (negative MW in raw data) for ESP net power
    g9_pump = gen_jw[(gen_jw["business_date"].isin(curt_9_days)) & (gen_jw["operating_mode"] == "Pobór")].copy()
    pump_raw = g9_pump.groupby(["ts_dt", "power_plant"])["value"].sum().reindex(full_idx, fill_value=0.0).reset_index().rename(columns={"value": "pump_mw"})
    p_grid = p_grid.merge(pump_raw, on=["ts_dt", "power_plant"], how="left")
    p_grid["net_mw"] = p_grid["gen_mw"] + p_grid["pump_mw"]
    p_grid["tech_group"] = p_grid["power_plant"].map(classify_plant)
    p_grid = p_grid.merge(sys_9[["ts_dt", "business_date", "hour", "tot_curt_mw", "rce_pln"]], on="ts_dt", how="left")

    # Hourly tech profile (0..23) across the 9 expensive-curtailment weekdays
    tech_q = p_grid.groupby(["ts_dt", "hour", "tech_group"])["net_mw"].sum().unstack("tech_group", fill_value=0.0).reset_index()
    tech_q["thermalTotal"] = tech_q["lignite"] + tech_q["hard_coal"] + tech_q["gas_ccgt"] + tech_q["chp_coal_bio"]
    tech_q = tech_q.merge(sys_9[["ts_dt", "demand", "jg", "pv", "wi", "tot_curt_mw", "rce_pln", "cen_cost"]], on="ts_dt", how="left")
    hourly_9 = []
    for hr, hgrp in tech_q.groupby("hour"):
        hourly_9.append({
            "hour": int(hr),
            "ligniteMw": r1(hgrp["lignite"].mean()),
            "hardCoalMw": r1(hgrp["hard_coal"].mean()),
            "gasCcgtMw": r1(hgrp["gas_ccgt"].mean()),
            "chpMw": r1(hgrp["chp_coal_bio"].mean()),
            "thermalTotalMw": r1(hgrp["thermalTotal"].mean()),
            "espNetMw": r1(hgrp["pumped_storage"].mean()),
            "resJwMw": r1(hgrp["res_jw"].mean()),
            "jgSystemMw": r1(hgrp["jg"].mean()),
            "pvMw": r1(hgrp["pv"].mean()),
            "windMw": r1(hgrp["wi"].mean()),
            "curtailedMw": r1(hgrp["tot_curt_mw"].mean()),
            "demandMw": r1(hgrp["demand"].mean()),
            "rcePln": r1(hgrp["rce_pln"].mean()),
            "cenPln": r1(hgrp["cen_cost"].mean()),
        })

    # Verify exact zero-filled thermal ramp (7,981.9 -> 13,625.8 = +5,643.9 MW)
    h12_th = next(x for x in hourly_9 if x["hour"] == 12)["thermalTotalMw"]
    h20_th = next(x for x in hourly_9 if x["hour"] == 20)["thermalTotalMw"]
    assert abs(h12_th - 7981.9) <= 0.2 and abs(h20_th - 13625.8) <= 0.2, (h12_th, h20_th)

    # Plant-by-plant zero-filled table (37 plants)
    mid_exp_mask = p_grid["hour"].isin([9, 10, 11, 12, 13, 14, 15]) & (p_grid["tot_curt_mw"] > 0) & (p_grid["rce_pln"] >= 250)
    plants_records = []
    for idx, plant in enumerate(all_plants, 1):
        psub = p_grid[p_grid["power_plant"] == plant]
        tg = classify_plant(plant)
        u_tot = int(plant_total_units[plant])
        exp_sub = psub[mid_exp_mask.loc[psub.index]]
        h12_sub = psub[psub["hour"] == 12]
        h20_sub = psub[psub["hour"] == 20]

        gen_exp = float(exp_sub["gen_mw"].mean())
        net_exp = float(exp_sub["net_mw"].mean())
        spin_exp = float(exp_sub["spinning_units"].mean())
        gen_12 = float(h12_sub["gen_mw"].mean())
        net_12 = float(h12_sub["net_mw"].mean())
        gen_20 = float(h20_sub["gen_mw"].mean())
        net_20 = float(h20_sub["net_mw"].mean())
        spin_20 = float(h20_sub["spinning_units"].mean())

        ramp_gen = gen_20 - gen_12
        ramp_net = net_20 - net_12
        load_ratio = r1(gen_12 / gen_20 * 100.0) if gen_20 > 20.0 else None
        owner, voiv = PLANT_OWNER_MAP.get(plant, ("Operator KSE", "Polska"))

        plants_records.append({
            "id": f"JW-{idx:02d}",
            "plant": plant,
            "techGroup": tg,
            "owner": owner,
            "voivodeship": voiv,
            "unitsTotal": u_tot,
            "unitsSpinningExpCurt": r1(spin_exp),
            "mwGenExpCurt": r1(gen_exp),
            "mwNetExpCurt": r1(net_exp),
            "mwGen12h": r1(gen_12),
            "mwNet12h": r1(net_12),
            "mwGen20h": r1(gen_20),
            "mwNet20h": r1(net_20),
            "unitsSpinning20h": r1(spin_20),
            "rampGen12To20Mw": r1(ramp_gen),
            "rampNet12To20Mw": r1(ramp_net),
            "loadRatio12Vs20Pct": load_ratio,
            "pseVerifyUrl": "https://raporty.pse.pl/report/gen-jw",
        })
    plants_records.sort(key=lambda r: (r["mwGenExpCurt"], r["mwGen20h"]), reverse=True)

    # 5. Hourly profiles (24 points each) for showcase days in Figure 02
    showcase_dates = ["2026-06-24", "2026-07-08", "2026-08-10", "2026-09-09", "2026-09-10"]
    showcase_days: dict[str, Any] = {}
    for sdate in showcase_dates:
        s_sys = df[df["business_date"] == sdate].copy()
        s_jw = gen_jw[gen_jw["business_date"] == sdate].copy()
        s_gen = s_jw[s_jw["operating_mode"] == "Generacja"]
        s_pump = s_jw[s_jw["operating_mode"] == "Pobór"]

        # Map thermal vs ESP per ts_dt
        th_by_ts = (
            s_gen[s_gen["tech_group"].isin(["lignite", "hard_coal", "gas_ccgt", "chp_coal_bio"])]
            .groupby("ts_dt")["value"].sum()
        )
        lig_by_ts = s_gen[s_gen["tech_group"] == "lignite"].groupby("ts_dt")["value"].sum()
        hc_by_ts = s_gen[s_gen["tech_group"] == "hard_coal"].groupby("ts_dt")["value"].sum()
        gas_by_ts = s_gen[s_gen["tech_group"] == "gas_ccgt"].groupby("ts_dt")["value"].sum()
        esp_by_ts = (
            s_jw[s_jw["tech_group"] == "pumped_storage"]
            .groupby("ts_dt")["value"].sum()
        )
        s_sys["th_mw"] = s_sys["ts_dt"].map(th_by_ts).fillna(0.0)
        s_sys["lig_mw"] = s_sys["ts_dt"].map(lig_by_ts).fillna(0.0)
        s_sys["hc_mw"] = s_sys["ts_dt"].map(hc_by_ts).fillna(0.0)
        s_sys["gas_mw"] = s_sys["ts_dt"].map(gas_by_ts).fillna(0.0)
        s_sys["esp_mw"] = s_sys["ts_dt"].map(esp_by_ts).fillna(0.0)

        pts_hourly = []
        for hr, hgrp in s_sys.groupby("hour"):
            pts_hourly.append({
                "hour": int(hr),
                "thermalTotalMw": r1(hgrp["th_mw"].mean()),
                "ligniteMw": r1(hgrp["lig_mw"].mean()),
                "hardCoalMw": r1(hgrp["hc_mw"].mean()),
                "gasCcgtMw": r1(hgrp["gas_mw"].mean()),
                "espNetMw": r1(hgrp["esp_mw"].mean()),
                "jgSystemMw": r1(hgrp["jg"].mean()),
                "pvMw": r1(hgrp["pv"].mean()),
                "windMw": r1(hgrp["wi"].mean()),
                "curtailedMw": r1(hgrp["tot_curt_mw"].mean()),
                "demandMw": r1(hgrp["demand"].mean()),
                "rcePln": r1(hgrp["rce_pln"].mean()),
                "csdacPln": r1(hgrp["csdac_best"].mean()),
                "cenPln": r1(hgrp["cen_cost"].mean()),
            })
        curt_tot_gwh = r2(s_sys["tot_curt_mwh"].sum() / 1000.0)
        curt_ge250_gwh = r2(s_sys.loc[s_sys["rce_pln"] >= 250, "tot_curt_mwh"].sum() / 1000.0)
        showcase_days[sdate] = {
            "date": sdate,
            "curtailedGwh": curt_tot_gwh,
            "curtailedGe250Gwh": curt_ge250_gwh,
            "peakCurtailedMw": r1(s_sys["tot_curt_mw"].max()),
            "peakRcePln": r1(s_sys["rce_pln"].max()),
            "peakCsdacPln": r1(s_sys["csdac_best"].max()),
            "peakCenPln": r1(s_sys["cen_cost"].max()),
            "h12ThermalMw": next(x for x in pts_hourly if x["hour"] == 12)["thermalTotalMw"],
            "h20ThermalMw": next(x for x in pts_hourly if x["hour"] == 20)["thermalTotalMw"],
            "hourly": pts_hourly,
        }

    # 6. Cross-border regimes (strictly 2026 YTD: 29,376 quarters with 100% sched & loop coverage)
    d26 = df[df["business_date"] >= "2026-01-01"].copy()
    border_keys = ["DE", "CZ", "SK", "SE", "LT", "UA", "ALL"]
    regime_defs = [
        ("all_curt", d26["tot_curt_mw"] > 0),
        ("rce_neg", (d26["tot_curt_mw"] > 0) & (d26["rce_pln"] < 0)),
        ("rce_ge250", (d26["tot_curt_mw"] > 0) & (d26["rce_pln"] >= 250)),
        ("rce_ge400", (d26["tot_curt_mw"] > 0) & (d26["rce_pln"] >= 400)),
        ("net_import", (d26["tot_curt_mw"] > 0) & (d26["phys_net_ALL"] > 0)),
    ]
    border_regimes: dict[str, Any] = {}
    for rcode, rmask in regime_defs:
        rsub = d26[rmask]
        bmap = {}
        for bk in border_keys:
            bmap[bk] = {
                "physMw": r1(rsub[f"phys_net_{bk}"].mean()),
                "schedMw": r1(rsub[f"sched_net_{bk}"].mean()),
                "loopMw": r1(rsub[f"loop_net_{bk}"].mean()),
                "inflowSharePct": r1((rsub[f"phys_net_{bk}"] > 0).mean() * 100.0),
            }
        border_regimes[rcode] = {
            "quarters": int(len(rsub)),
            "hours": r2(len(rsub) * 0.25),
            "curtailedGwh": r2(rsub["tot_curt_mwh"].sum() / 1000.0),
            "meanRcePln": r1(rsub["rce_pln"].mean()),
            "borders": bmap,
        }
    assert border_regimes["rce_ge250"]["borders"]["DE"]["loopMw"] == 605.2
    assert border_regimes["net_import"]["quarters"] == 862

    # 7. Prosumer dynamic net-billing RCE metrics (2026 YTD)
    pv_tot_mwh_26 = float((d26["pv"] * 0.25).sum())
    pv_le0_mwh_26 = float((d26.loc[d26["rce_pln"] <= 0, "pv"] * 0.25).sum())
    d26_apr = d26[d26["business_date"].str.startswith("2026-04")]
    pv_apr_le0_pct = float((d26_apr.loc[d26_apr["rce_pln"] <= 0, "pv"].sum()) / d26_apr["pv"].sum() * 100.0)
    pv_weighted_rce = float((d26["pv"] * 0.25 * d26["rce_pln"].clip(lower=0)).sum() / pv_tot_mwh_26)
    eve_26 = d26[d26["hour"].isin([18, 19, 20, 21])]
    eve_mean_rce = float(eve_26["rce_pln"].mean())

    # 8. Top 120 curtailment episodes (days) in 2025–2026 for Explorer Lens 2
    day_rows = []
    for bdate, dgrp in df_25_26.groupby("business_date"):
        tot_gwh = float(dgrp["tot_curt_mwh"].sum() / 1000.0)
        if tot_gwh < 3.0:
            continue
        pv_gwh = float(dgrp["pv_curt_mw"].sum() * 0.25 / 1000.0)
        wi_gwh = float(dgrp["wi_curt_mw"].sum() * 0.25 / 1000.0)
        ge250_gwh = float(dgrp.loc[dgrp["rce_pln"] >= 250, "tot_curt_mwh"].sum() / 1000.0)
        curt_q = dgrp[dgrp["tot_curt_mw"] > 0]
        w_rce = float((curt_q["tot_curt_mwh"] * curt_q["rce_pln"]).sum() / curt_q["tot_curt_mwh"].sum())
        rce_val_mln = float((dgrp["tot_curt_mwh"] * dgrp["rce_pln"].clip(lower=0)).sum() / 1e6)
        cen_val_mln = float((dgrp["tot_curt_mwh"] * dgrp["cen_cost"].clip(lower=0)).sum() / 1e6)
        h12_jg = float(dgrp.loc[dgrp["hour"] == 12, "jg"].mean())
        h20_jg = float(dgrp.loc[dgrp["hour"] == 20, "jg"].mean())
        h20_rce = float(dgrp.loc[dgrp["hour"] == 20, "rce_pln"].mean())
        de_phys = float(curt_q["phys_net_DE"].mean()) if curt_q["phys_net_DE"].notna().any() else None
        de_loop = float(curt_q["loop_net_DE"].mean()) if curt_q["loop_net_DE"].notna().any() else None
        net_imp_q = int((curt_q["phys_net_ALL"] > 0).sum()) if curt_q["phys_net_ALL"].notna().any() else 0

        day_rows.append({
            "date": str(bdate),
            "year": int(str(bdate)[:4]),
            "isWeekend": bool(dgrp["is_weekend"].iloc[0]),
            "curtailedGwh": r2(tot_gwh),
            "pvGwh": r2(pv_gwh),
            "windGwh": r2(wi_gwh),
            "rceGe250Gwh": r2(ge250_gwh),
            "rceGe250Pct": r1(ge250_gwh / tot_gwh * 100.0),
            "peakCurtailedMw": r1(dgrp["tot_curt_mw"].max()),
            "weightedCurtRcePln": r1(w_rce),
            "jg12hMw": r1(h12_jg),
            "jg20hMw": r1(h20_jg),
            "jgRampMw": r1(h20_jg - h12_jg),
            "rce20hPln": r1(h20_rce),
            "valRceMln": r2(rce_val_mln),
            "valCenMln": r2(cen_val_mln),
            "dePhysMw": r1(de_phys) if de_phys is not None else None,
            "deLoopMw": r1(de_loop) if de_loop is not None else None,
            "netImportQuarters": net_imp_q,
            "pseVerifyUrl": f"https://raporty.pse.pl/report/poze-redoze?date={bdate}",
        })
    day_rows.sort(key=lambda r: (r["rceGe250Gwh"], r["curtailedGwh"]), reverse=True)
    top_days = day_rows[:140]

    dataset = {
        "meta": {
            "id": "pse-grid-curtailment-2024-2026",
            "generatedAt": "2026-11-04",
            "rangeStart": "2024-09-24",
            "rangeEnd": "2026-11-02",
            "calendarDays": 770,
            "continuousQuarters": 73924,
            "zeroMissingQuarters": True,
            "sources": [
                {"name": "PSE API v2 — poze-redoze", "url": "https://api.raporty.pse.pl/api/poze-redoze"},
                {"name": "PSE API v2 — his-wlk-cal", "url": "https://api.raporty.pse.pl/api/his-wlk-cal"},
                {"name": "PSE API v2 — rce-pln & energy-prices (cen_cost)", "url": "https://api.raporty.pse.pl/api/energy-prices"},
                {"name": "PSE API v2 — przeplywy-mocy & pwm-rdn-rdb", "url": "https://api.raporty.pse.pl/api/przeplywy-mocy"},
                {"name": "PSE API v2 — gen-jw (106 bloków w 37 elektrowniach)", "url": "https://api.raporty.pse.pl/api/gen-jw"},
                {"name": "PSE S.A. — Zasady wyliczania rekompensaty finansowej PV (03.2026)", "url": "https://www.pse.pl/documents/20182/2159526425/Zasady_wyliczania_rekompensaty_finansowej_PV.pdf"},
                {"name": "PSE S.A. — Spotkanie z Wytwórcami OZE (23.05.2025, 58 slajdów)", "url": "https://www.pse.pl/documents/20182/98814780/20250523_Redysponowanie_OZE_spotkanie_z_wytworcami.pdf"},
                {"name": "Prezes URE — Sprawozdanie dot. redysponowania za 2024 r. (27.10.2025)", "url": "https://www.ure.gov.pl/download/9/15780/Sprawozdaniedotredysponowaniaza2024r.pdf"},
            ],
        },
        "summary": {
            "periods": {
                "q4_2024": p_2024_q4,
                "full_2025": p_2025_full,
                "ytd_2025": p_2025_ytd,
                "ytd_2026": p_2026_ytd,
            },
            "yoyChangesPct": {
                "curtailedGwh": r1((p_2026_ytd["curtailedGwh"] / p_2025_ytd["curtailedGwh"] - 1.0) * 100.0),
                "pvGwh": r1((p_2026_ytd["pvCurtailedGwh"] / p_2025_ytd["pvCurtailedGwh"] - 1.0) * 100.0),
                "windGwh": r1((p_2026_ytd["windCurtailedGwh"] / p_2025_ytd["windCurtailedGwh"] - 1.0) * 100.0),
                "rceGe250Gwh": r1((p_2026_ytd["rceGe250Gwh"] / p_2025_ytd["rceGe250Gwh"] - 1.0) * 100.0),
                "rceGe400Gwh": r1((p_2026_ytd["rceGe400Gwh"] / p_2025_ytd["rceGe400Gwh"] - 1.0) * 100.0),
                "valRceMax0": r1((p_2026_ytd["valRceMax0Mln"] / p_2025_ytd["valRceMax0Mln"] - 1.0) * 100.0),
                "valCenMax0": r1((p_2026_ytd["valCenMax0Mln"] / p_2025_ytd["valCenMax0Mln"] - 1.0) * 100.0),
            },
            "monthlySeries": monthly_series,
            "cenBrackets2026": cen_brackets,
            "cashPayouts": {
                "paid2023Mln": 19.5,
                "paid2024Mln": 2.7,
                "paid2025Mln": 25.4,
                "paidJanJul2026Mln": 57.9,
                "paidTotal2023ToJul2026Mln": 105.5,
                "queuedAcceptedAug2026Mln": 45.0,
                "qualityFee2021PlnMwh": 10.18,
                "qualityFee2024PlnMwh": 31.41,
                "qualityFee2025PlnMwh": 32.12,
                "qualityFeeFeb2026PlnMwh": 33.16,
                "tauron2025SettledPct": 36.0,
                "enea2025ApprovedPct": 68.0,
            },
            "guillotine": {
                "period2025_2026": guillotine_25_26,
                "period2026Ytd": guillotine_2026,
            },
            "thermalRamp9Days": {
                "sampleDates": curt_9_days,
                "controlDates": ["2026-07-15", "2026-09-10"],
                "plantsTotal": len(all_plants),
                "unitsTotal": int(gen_jw["resource_code"].nunique()),
                "h12PureThermalMw": 7981.9,
                "h20PureThermalMw": 13625.8,
                "pureThermalRampMw": 5643.9,
                "h12EspNetMw": -775.8,
                "h20EspNetMw": 693.7,
                "thermalPlusEspSwingMw": 7113.4,
                "h12JgSystemMw": 7536.7,
                "h20JgSystemMw": 13834.9,
                "jgSystemRampMw": 6298.3,
                "hourly": hourly_9,
            },
            "showcaseDays": showcase_days,
            "borderRegimes2026": border_regimes,
            "prosumer2026Ytd": {
                "pvTotalGwh": r2(pv_tot_mwh_26 / 1000.0),
                "pvAtZeroOrNegGwh": r2(pv_le0_mwh_26 / 1000.0),
                "pvAtZeroOrNegPct": r2(pv_le0_mwh_26 / pv_tot_mwh_26 * 100.0),
                "april2026ZeroOrNegPct": r1(pv_apr_le0_pct),
                "pvWeightedRcePln": r2(pv_weighted_rce),
                "pvWeightedWith123MultiplierPln": r2(pv_weighted_rce * 1.23),
                "evening18To22MeanRcePln": r2(eve_mean_rce),
                "rawSpotScissorsRatio": r2(eve_mean_rce / pv_weighted_rce),
                "after123MultiplierRatio": r2(eve_mean_rce / (pv_weighted_rce * 1.23)),
            },
        },
        "plants": plants_records,
        "days": top_days,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(dataset, ensure_ascii=False, separators=(",", ":"))
    OUT_JSON.write_text(serialized + "\n", encoding="utf-8")
    print(
        f"OK: Wrote {OUT_JSON} ({len(serialized):,} bytes) | "
        f"73,924 quarters | {len(plants_records)} plants | {len(top_days)} days."
    )


if __name__ == "__main__":
    main()
