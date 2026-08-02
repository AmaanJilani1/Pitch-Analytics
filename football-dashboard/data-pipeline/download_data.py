import argparse
import os
import sys
import shutil
import zipfile
from pathlib import Path

def download_datasets(dest_dir: str):
    kaggle_user = os.environ.get("KAGGLE_USERNAME")
    kaggle_key = os.environ.get("KAGGLE_KEY")

    if not kaggle_user or not kaggle_key:
        print("\n❌ ERROR: Kaggle API credentials missing!")
        print("Please add 'KAGGLE_USERNAME' and 'KAGGLE_KEY' as Secrets in your GitHub repository:")
        print("  1. Go to your GitHub repository -> Settings -> Secrets and variables -> Actions")
        print("  2. Click 'New repository secret' and add both KAGGLE_USERNAME and KAGGLE_KEY from your kaggle.json file.\n")
        sys.exit(1)

    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
    except ImportError:
        raise ImportError("The 'kaggle' package is required. Install it using 'pip install kaggle'.")

    api = KaggleApi()
    api.authenticate()

    os.makedirs(dest_dir, exist_ok=True)
    temp_dir = os.path.join(dest_dir, "_temp_kaggle")
    os.makedirs(temp_dir, exist_ok=True)

    print("Fetching 'hubertsidorowicz/football-players-stats-2025-2026' from Kaggle...")
    api.dataset_download_files("hubertsidorowicz/football-players-stats-2025-2026", path=temp_dir, unzip=True)

    print("Fetching 'davidcariboo/player-scores' from Kaggle...")
    api.dataset_download_files("davidcariboo/player-scores", path=temp_dir, unzip=True)

    target_files = [
        "players_data-2025_2026.csv",
        "players.csv",
        "player_valuations.csv",
        "clubs.csv",
        "transfers.csv"
    ]

    for fname in target_files:
        src = os.path.join(temp_dir, fname)
        dst = os.path.join(dest_dir, fname)
        if os.path.exists(src):
            shutil.move(src, dst)
            print(f"Successfully updated: {fname}")
        else:
            print(f"Warning: {fname} was not found in downloaded Kaggle archives.")

    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    print("Kaggle dataset download complete!")

def main():
    parser = argparse.ArgumentParser(description="Download targeted football datasets from Kaggle API")
    parser.add_argument("--dest-dir", default="../../", help="Destination folder for CSV datasets")
    args = parser.parse_args()

    dest_dir = os.path.abspath(args.dest_dir)
    download_datasets(dest_dir)

if __name__ == "__main__":
    main()
