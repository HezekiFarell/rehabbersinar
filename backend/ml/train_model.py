"""
train_model.py
Random Forest MULTI-LABEL untuk sistem rekomendasi materi.

Data   : data_181.csv (181 responden)
Fitur  : Usia, Status, P1-P6
Label  : 6 kategori biner dari minat_edukasi
"""

from pathlib import Path
import numpy as np
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ================= KONFIGURASI =================
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "model_rf_6kategori.pkl"
DATA_PATH = BASE_DIR / "ml" / "data_181.csv"

CATEGORIES = [
    "pengetahuan",
    "kesehatan",
    "pencegahan",
    "keluarga",
    "program",
    "pola hidup sehat",
]

STATUS_MAP = {
    "pelajar": 0,
    "mahasiswa": 1,
    "pegawai swasta/bumn": 2,
    "pegawai sipil (pns)/asn": 3,
    "wiraswasta/wirausaha": 4,
    "ibu rumah tangga": 5,
}

MINAT_TO_KATEGORI = {
    "Narkotika dan jenis-jenisnya": ["pengetahuan"],
    "Dampak penyalahgunaan narkoba bagi kesehatan": ["kesehatan"],
    "Proses dan layanan rehabilitasi": ["program"],
    "Cara mencegah penyalahgunaan dan kekambuhan": ["pencegahan"],
    "Peran keluarga dalam pemulihan": ["keluarga"],
    "Cara menerapkan pola hidup sehat": ["pola hidup sehat"],
    "Program rehabilitasi dan layanan pasca rehabilitasi": ["program"],
    "Saya ingin mempelajari semua topik di atas": CATEGORIES,  # semua
}

FEATURES_NUM = ["Usia", "P1", "P2", "P3", "P4", "P5", "P6"]
FEATURES_CAT = ["Status"]


# ================= DATA =================
def load_and_prepare():
    df = pd.read_csv(DATA_PATH, encoding="utf-8-sig")  # handle BOM
    df.columns = [c.strip() for c in df.columns]

    # Normalisasi status ke lowercase
    df["Status"] = df["Status"].astype(str).str.strip().str.lower()

    # Buat 6 kolom label biner
    for kat in CATEGORIES:
        df[f"y_{kat}"] = df["minat_edukasi"].apply(
            lambda m: 1 if kat in MINAT_TO_KATEGORI.get(m, []) else 0
        )

    return df


# ================= TRAINING =================
def train():
    df = load_and_prepare()

    print("=" * 70)
    print("DISTRIBUSI LABEL")
    print("=" * 70)
    for kat in CATEGORIES:
        print(f"  {kat:20s}: {df[f'y_{kat}'].sum():3d} positif")

    X = df[FEATURES_CAT + FEATURES_NUM]
    Y = df[[f"y_{k}" for k in CATEGORIES]]

    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=0.20, random_state=42,
    )

    preprocess = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), FEATURES_CAT),
        ],
        remainder="passthrough",
    )

    model = Pipeline([
        ("prep", preprocess),
        ("clf", MultiOutputClassifier(
            RandomForestClassifier(
                n_estimators=500,
                criterion="gini",
                min_samples_leaf=2,
                class_weight="balanced_subsample",
                random_state=42,
                n_jobs=-1,
            )
        )),
    ])

    model.fit(X_train, Y_train)

    # ============ EVALUASI ============
    Y_pred = model.predict(X_test)

    print("\n" + "=" * 70)
    print("EVALUASI PER KATEGORI")
    print("=" * 70)
    print(f"Train / Test : {len(X_train)} / {len(X_test)}")

    for i, kat in enumerate(CATEGORIES):
        print(f"\n=== {kat} ===")
        print(classification_report(
            Y_test.iloc[:, i], Y_pred[:, i],
            zero_division=0, digits=3,
        ))

    # ============ FEATURE IMPORTANCE ============
    cat_features = list(
        model.named_steps["prep"]
        .named_transformers_["cat"]
        .get_feature_names_out(FEATURES_CAT)
    )
    all_features = cat_features + FEATURES_NUM

    importances = np.mean([
        est.feature_importances_
        for est in model.named_steps["clf"].estimators_
    ], axis=0)

    imp_df = pd.DataFrame({
        "fitur": all_features,
        "importance": importances,
    }).sort_values("importance", ascending=False)

    print("\n" + "=" * 70)
    print("FEATURE IMPORTANCE (rata-rata 6 kategori)")
    print("=" * 70)
    print(imp_df.to_string(index=False))

    # ============ SIMPAN ============
    artifact = {
        "model": model,
        "features_num": FEATURES_NUM,
        "features_cat": FEATURES_CAT,
        "categories": CATEGORIES,
        "status_map": STATUS_MAP,
        "minat_to_kategori": MINAT_TO_KATEGORI,
    }
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, MODEL_PATH)
    print(f"\nModel disimpan: {MODEL_PATH}")


if __name__ == "__main__":
    train()