import argparse
import json
import math
import os
import re
import unicodedata
from pathlib import Path
import numpy as np
import pandas as pd

try:
    from rapidfuzz import fuzz
    def fuzzy_ratio(a: str, b: str) -> float:
        return fuzz.ratio(a, b)
except ImportError:
    from difflib import SequenceMatcher
    def fuzzy_ratio(a: str, b: str) -> float:
        return SequenceMatcher(None, a, b).ratio() * 100

LEAGUE_MAP = {
    "eng Premier League": {"name": "Premier League", "code": "GB1"},
    "es La Liga":         {"name": "La Liga",        "code": "ES1"},
    "de Bundesliga":      {"name": "Bundesliga",     "code": "L1"},
    "it Serie A":         {"name": "Serie A",        "code": "IT1"},
    "fr Ligue 1":         {"name": "Ligue 1",        "code": "FR1"},
}

TOP5_COMP_IDS = {"GB1", "ES1", "L1", "IT1", "FR1"}

POSITION_MAP = {
    "GK": "GK", "DF": "DF", "DF,MF": "DF", "DF,FW": "DF",
    "MF": "MF", "MF,DF": "MF", "MF,FW": "MF",
    "FW": "FW", "FW,MF": "FW", "FW,DF": "FW",
}

RADAR_CONFIGS = {
    "FW": [("Goals/90", "goals_per90"), ("Assists/90", "assists_per90"), ("Shots/90", "sh_per90"), ("SoT%", "sot_pct"), ("G+A/90", "ga_per90"), ("Minutes", "minutes")],
    "MF": [("Goals/90", "goals_per90"), ("Assists/90", "assists_per90"), ("Tackles/90", "tklw_per90"), ("Interceptions/90", "int_per90"), ("Fouls Drawn/90", "fld_per90"), ("G+A/90", "ga_per90")],
    "DF": [("Tackles/90", "tklw_per90"), ("Interceptions/90", "int_per90"), ("Fouls Drawn/90", "fld_per90"), ("Goals/90", "goals_per90"), ("Assists/90", "assists_per90"), ("Minutes", "minutes")],
    "GK": [("Save%", "save_pct"), ("CS%", "cs_pct"), ("GA/90", "ga90"), ("W", "wins"), ("PKsv", "pksv"), ("Minutes", "minutes")],
}

def strip_accents(s: str) -> str:
    if not isinstance(s, str):
        return ""
    return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))

def normalize_name(name: str) -> str:
    s = strip_accents(name).lower().strip()
    s = re.sub(r"['\-\.]", "", s)
    return re.sub(r"\s+", " ", s)

def normalize_club(club: str) -> str:
    s = strip_accents(club).lower().strip()
    for suffix in [" fc", " cf", " sc", " afc", " ssc", " ac", " as", " s.p.a.", " spa", " s.a.", " sa"]:
        if s.endswith(suffix):
            s = s[:-len(suffix)]
    s = re.sub(r"['\-\.]", "", s)
    return re.sub(r"\s+", " ", s).strip()

def safe_float(val, default=0.0):
    try:
        v = float(val)
        return v if not math.isnan(v) else default
    except (ValueError, TypeError):
        return default

def safe_int(val, default=0):
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default

def percentile_rank(series: pd.Series) -> pd.Series:
    return series.rank(pct=True, method="average") * 100

def make_player_id(row) -> int:
    name = normalize_name(str(row.get("Player", "")))
    club = normalize_club(str(row.get("Squad", "")))
    return int(abs(hash(f"{name}_{club}")) % 10**8)

def load_fbref(data_dir: str) -> pd.DataFrame:
    path = os.path.join(data_dir, "players_data-2025_2026.csv")
    df = pd.read_csv(path, encoding="utf-8", on_bad_lines="skip")
    df["_norm_name"] = df["Player"].apply(normalize_name)
    df["_norm_club"] = df["Squad"].apply(normalize_club)
    df["_league_name"] = df["Comp"].map(lambda c: LEAGUE_MAP.get(c, {}).get("name", c))
    df["_league_code"] = df["Comp"].map(lambda c: LEAGUE_MAP.get(c, {}).get("code", ""))
    df["_position"] = df["Pos"].map(lambda p: POSITION_MAP.get(str(p).strip(), "MF"))
    return df

def load_transfermarkt_players(data_dir: str) -> pd.DataFrame:
    path = os.path.join(data_dir, "players.csv")
    df = pd.read_csv(path, encoding="utf-8", on_bad_lines="skip")
    df = df[df["current_club_domestic_competition_id"].isin(TOP5_COMP_IDS)].copy()
    df["_norm_name"] = df["name"].apply(normalize_name)
    df["_norm_club"] = df["current_club_name"].apply(lambda x: normalize_club(str(x)) if pd.notna(x) else "")
    df["_comp_id"] = df["current_club_domestic_competition_id"]
    return df

def join_datasets(fbref: pd.DataFrame, tm: pd.DataFrame) -> pd.DataFrame:
    merged = fbref.merge(
        tm[["player_id", "_norm_name", "_norm_club", "_comp_id", "image_url", "market_value_in_eur", "highest_market_value_in_eur"]],
        on=["_norm_name", "_norm_club"],
        how="left"
    )

    unmatched = merged[merged["player_id"].isna()].copy()
    for idx, row in unmatched.iterrows():
        candidates = tm[tm["_comp_id"] == row["_league_code"]]
        if candidates.empty:
            continue
        best_score, best_row = 0, None
        for _, cand in candidates.iterrows():
            score = fuzzy_ratio(row["_norm_name"], cand["_norm_name"])
            if score > best_score:
                best_score, best_row = score, cand

        if best_score >= 80 and best_row is not None:
            merged.at[idx, "player_id"] = best_row["player_id"]
            merged.at[idx, "image_url"] = best_row["image_url"]
            merged.at[idx, "market_value_in_eur"] = best_row["market_value_in_eur"]

    return merged

def compute_derived(df: pd.DataFrame) -> pd.DataFrame:
    nineties = df["90s"].apply(lambda x: safe_float(x, 0.001)).clip(lower=0.1)
    df["goals_per90"] = df["Gls"].apply(safe_float) / nineties
    df["assists_per90"] = df["Ast"].apply(safe_float) / nineties
    df["ga_per90"] = df["G+A"].apply(safe_float) / nineties
    df["sh_per90"] = df["Sh"].apply(safe_float) / nineties
    df["tklw_per90"] = df["TklW"].apply(safe_float) / nineties
    df["int_per90"] = df["Int"].apply(safe_float) / nineties
    df["fld_per90"] = df["Fld"].apply(safe_float) / nineties
    df["sot_pct"] = df["SoT%"].apply(safe_float)
    df["minutes"] = df["Min"].apply(safe_float)

    for pos in ["FW", "MF", "DF", "GK"]:
        mask = df["_position"] == pos
        if mask.sum() == 0:
            continue
        stats_to_rank = ["goals_per90", "assists_per90", "ga_per90", "sh_per90", "sot_pct", "tklw_per90", "int_per90", "fld_per90", "minutes"]
        for stat in stats_to_rank:
            df.loc[mask, f"{stat}_pctile"] = percentile_rank(df.loc[mask, stat])

    df["_id"] = df.apply(make_player_id, axis=1)
    return df

def compute_similarity(df: pd.DataFrame) -> dict:
    sim_stats = {
        "FW": ["goals_per90", "assists_per90", "sh_per90", "sot_pct", "ga_per90", "minutes"],
        "MF": ["goals_per90", "assists_per90", "tklw_per90", "int_per90", "fld_per90", "ga_per90"],
        "DF": ["tklw_per90", "int_per90", "fld_per90", "goals_per90", "assists_per90", "minutes"],
        "GK": ["save_pct", "cs_pct", "ga90", "wins", "pksv", "minutes"],
    }
    similarity_map = {}
    for pos, stats in sim_stats.items():
        pos_df = df[df["_position"] == pos].copy()
        if len(pos_df) < 3:
            continue
        matrix = pos_df[stats].apply(pd.to_numeric, errors="coerce").fillna(0).values
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1, norms)
        normalized = matrix / norms
        cos_sim = normalized @ normalized.T

        ids = pos_df["_id"].values
        names = pos_df["Player"].values
        clubs = pos_df["Squad"].values
        photos = pos_df.get("image_url", pd.Series([""]*len(pos_df))).values

        for i in range(len(pos_df)):
            scores = cos_sim[i]
            top_indices = np.argsort(scores)[::-1]
            similar = []
            for j in top_indices:
                if j == i:
                    continue
                similar.append({
                    "id": int(ids[j]),
                    "name": str(names[j]),
                    "club": str(clubs[j]),
                    "position": pos,
                    "similarity": round(float(scores[j]), 3),
                    "photo_url": str(photos[j]) if pd.notna(photos[j]) else "",
                })
                if len(similar) >= 5:
                    break
            similarity_map[int(ids[i])] = similar

    return similarity_map

def export_players_json(df: pd.DataFrame, output_dir: str):
    players = []
    for _, row in df.iterrows():
        players.append({
            "id": int(row["_id"]),
            "name": str(row["Player"]),
            "club": str(row["Squad"]),
            "league": str(row["_league_name"]),
            "position": str(row["_position"]),
            "age": safe_int(row["Age"]),
            "photo_url": str(row.get("image_url", "")) if pd.notna(row.get("image_url")) else "",
            "goals": safe_int(row.get("Gls", 0)),
            "assists": safe_int(row.get("Ast", 0)),
            "xg": round(safe_float(row.get("xG", 0)), 2),
            "xag": round(safe_float(row.get("xAG", 0)), 2),
            "minutes": safe_int(row.get("Min", 0)),
            "market_value": safe_float(row.get("market_value_in_eur", 0)),
            "goals_per_90": round(safe_float(row.get("goals_per90", 0)), 2),
            "assists_per_90": round(safe_float(row.get("assists_per90", 0)), 2),
        })

    out_path = os.path.join(output_dir, "players.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(players, f, ensure_ascii=False)

def main():
    parser = argparse.ArgumentParser(description="Football Dashboard Data Pipeline")
    parser.add_argument("--data-dir", default="../../")
    parser.add_argument("--output-dir", default="../frontend/public/data")
    args = parser.parse_args()

    data_dir = os.path.abspath(args.data_dir)
    output_dir = os.path.abspath(args.output_dir)
    os.makedirs(output_dir, exist_ok=True)

    fbref = load_fbref(data_dir)
    tm_players = load_transfermarkt_players(data_dir)
    merged = join_datasets(fbref, tm_players)
    merged = compute_derived(merged)
    export_players_json(merged, output_dir)

if __name__ == "__main__":
    main()
