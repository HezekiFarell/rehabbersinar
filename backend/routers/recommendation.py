from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import User

from schemas import (
    RecommendationInput,
    RecommendationResponse,
    RecommendationOut,
)

from ml.recommendation import recommend_materials


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendation"]
)


# =========================================================
# GET /recommendations
# Digunakan Dashboard untuk user yang sedang login
# =========================================================
@router.get("", response_model=list[RecommendationOut])
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Menghasilkan rekomendasi materi berdasarkan:
    - usia
    - status
    - minat edukasi
    - P1-P6
    """

    # Pastikan semua data yang dibutuhkan RF tersedia
    required_fields = {
        "status": current_user.status,
        "minat_edukasi": current_user.minat_edukasi,
        "p1": current_user.p1,
        "p2": current_user.p2,
        "p3": current_user.p3,
        "p4": current_user.p4,
        "p5": current_user.p5,
        "p6": current_user.p6,
    }

    missing_fields = [
        field
        for field, value in required_fields.items()
        if value is None
    ]

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Data personalisasi belum lengkap.",
                "missing_fields": missing_fields,
            },
        )

    payload = {
        "usia": current_user.usia,
        "status": current_user.status,
        "minat_edukasi": current_user.minat_edukasi,
        "p1": current_user.p1,
        "p2": current_user.p2,
        "p3": current_user.p3,
        "p4": current_user.p4,
        "p5": current_user.p5,
        "p6": current_user.p6,
    }

    try:
        rankings, recommendations = recommend_materials(
            db,
            payload,
            limit=12,
        )

        # Dashboard saat ini membutuhkan ARRAY langsung,
        # bukan object {rankings, recommendations}.
        return recommendations

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal menghasilkan rekomendasi: {exc}",
        )


# =========================================================
# POST /recommendations/predict
# Untuk testing/manual prediction
# =========================================================
@router.post(
    "/predict",
    response_model=RecommendationResponse
)
def predict_recommendation(
    payload: RecommendationInput,
    db: Session = Depends(get_db),
):
    try:
        rankings, recommendations = recommend_materials(
            db,
            payload.model_dump(),
            limit=12,
        )

        return {
            "rankings": rankings,
            "recommendations": recommendations,
        }

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal menghasilkan rekomendasi: {exc}",
        )