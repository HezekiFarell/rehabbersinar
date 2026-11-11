"""
recommendation.py
Sistem rekomendasi materi berbasis Random Forest multi-label.
"""
from pathlib import Path
import sys

# ---- FIX: pastikan folder backend/ ada di sys.path ----
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
# -------------------------------------------------------

import joblib
import pandas as pd
from sqlalchemy.orm import Session

from models import Materi   # ← sekarang bisa

MODEL_PATH = Path(__file__).resolve().parent / "model_rf_6kategori.pkl"

_model_artifact = None


def load_artifact():
    global _model_artifact
    if _model_artifact is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model belum ada: {MODEL_PATH}. "
                "Jalankan: python ml/train_model.py"
            )
        _model_artifact = joblib.load(MODEL_PATH)
    return _model_artifact


def _normalize_status(status: str) -> str:
    return (status or "").strip().lower()


def _build_feature_row(payload: dict) -> pd.DataFrame:
    artifact = load_artifact()
    features_cat = artifact["features_cat"]
    features_num = artifact["features_num"]

    row = {
        "Status": _normalize_status(payload.get("status")),
        "Usia": payload["usia"],
        "P1": payload["p1"],
        "P2": payload["p2"],
        "P3": payload["p3"],
        "P4": payload["p4"],
        "P5": payload["p5"],
        "P6": payload["p6"],
    }
    return pd.DataFrame([row])[features_cat + features_num]


def predict_category_ranking(payload: dict) -> list:
    artifact = load_artifact()
    model = artifact["model"]
    categories = artifact["categories"]

    X = _build_feature_row(payload)
    probas = model.predict_proba(X)

    skor = {
        kat: float(probas[i][0][1])
        for i, kat in enumerate(categories)
    }

    return [
        {
            "rank": idx + 1,
            "category": kat,
            "probability": round(prob, 4),
        }
        for idx, (kat, prob) in enumerate(
            sorted(skor.items(), key=lambda x: x[1], reverse=True)
        )
    ]


def _level_dari_skor(prob: float) -> str:
    if prob >= 0.7:
        return "Sangat Dibutuhkan"
    if prob >= 0.4:
        return "Dibutuhkan"
    return "Cukup"


def _reason(category: str, probability: float) -> str:
    level = _level_dari_skor(probability)
    return (
        f"Kategori '{category}' memperoleh skor {probability:.1%} "
        f"({level}) berdasarkan profil Anda."
    )


def recommend_materials(db: Session, payload: dict, limit: int = 12):
    rankings = predict_category_ranking(payload)

    all_materials = (
        db.query(Materi)
        .filter(Materi.category.isnot(None))
        .all()
    )

    by_category = {}
    for materi in all_materials:
        by_category.setdefault(materi.category, []).append(materi)

    recommendations = []

    for item in rankings:
        category = item["category"]
        probability = item["probability"]

        materials = by_category.get(category, [])
        materials.sort(
            key=lambda m: (
                not getattr(m, "recommended", False),
                -getattr(m, "confidence", 0),
            )
        )

        for materi in materials:
            recommendations.append({
                "materi": materi,
                "category": category,
                "category_rank": item["rank"],
                "confidence": probability,
                "level": _level_dari_skor(probability),
                "reason": _reason(category, probability),
            })
            if len(recommendations) >= limit:
                return rankings, recommendations

    return rankings, recommendations