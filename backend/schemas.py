from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    nama: str
    password: str
    usia: int = Field(ge=10, le=100)
    gender: str
    status: Optional[str] = None
    pendidikan: Optional[str] = None
    kecamatan: str
    informed_consent: bool

    # Evaluasi penelitian
    pretest_answers: Optional[Dict[str, Any]] = None
    pretest_score: Optional[int] = None

    # Input personalisasi RF
    minat_edukasi: Optional[str] = None
    p1: Optional[int] = Field(default=None, ge=1, le=5)
    p2: Optional[int] = Field(default=None, ge=1, le=5)
    p3: Optional[int] = Field(default=None, ge=1, le=5)
    p4: Optional[int] = Field(default=None, ge=1, le=5)
    p5: Optional[int] = Field(default=None, ge=1, le=5)
    p6: Optional[int] = Field(default=None, ge=1, le=5)

    # # Preferensi presentasi materi
    # preferensi_format: Optional[str] = "campuran"
    # preferensi_waktu: Optional[int] = 30
    # preferensi_topik: Optional[str] = None


class UserOut(BaseModel):
    id: int
    nama: str
    usia: int
    gender: str
    kecamatan: str
    status: Optional[str] = None
    minat_edukasi: Optional[str] = None
    p1: Optional[int] = None
    p2: Optional[int] = None
    p3: Optional[int] = None
    p4: Optional[int] = None
    p5: Optional[int] = None
    p6: Optional[int] = None
    pretest_score: Optional[int] = None
    posttest_score: Optional[int] = None
    group: str
    is_admin: Optional[bool] = False

    class Config:
        from_attributes = True


class MateriOut(BaseModel):
    id: int
    title: str
    type: str
    duration: int
    icon: Optional[str] = None
    description: Optional[str] = None
    fullDescription: Optional[str] = None
    content: Optional[str] = None
    sources: Optional[List[Dict[str, str]]] = None
    videoUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    category: Optional[str] = None

    class Config:
        from_attributes = True


class RecommendationOut(BaseModel):
    materi: MateriOut
    category: str
    category_rank: int
    confidence: float
    reason: str


class CategoryRankingOut(BaseModel):
    rank: int
    category: str
    probability: float


class RecommendationResponse(BaseModel):
    rankings: List[CategoryRankingOut]
    recommendations: List[RecommendationOut]


class RecommendationInput(BaseModel):
    usia: int = Field(ge=10, le=100)
    status: str
    minat_edukasi: str
    p1: int = Field(ge=1, le=5)
    p2: int = Field(ge=1, le=5)
    p3: int = Field(ge=1, le=5)
    p4: int = Field(ge=1, le=5)
    p5: int = Field(ge=1, le=5)
    p6: int = Field(ge=1, le=5)


class InteractionCreate(BaseModel):
    user_id: int
    materi_id: int
    action: str
    duration: Optional[int] = None


class PostTestCreate(BaseModel):
    answers: Dict[str, Any]
    score: int


class FeedbackCreate(BaseModel):
    rating: int
    comment: Optional[str] = None


class UserUpdate(BaseModel):
    nama: Optional[str] = None
    usia: Optional[int] = None
    gender: Optional[str] = None


class MateriCreate(BaseModel):
    title: str
    type: str
    duration: int
    icon: Optional[str] = None
    description: Optional[str] = None
    fullDescription: Optional[str] = None
    videoUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    sources: Optional[List[Dict[str, str]]] = None


class MateriUpdate(MateriCreate):
    title: Optional[str] = None
    type: Optional[str] = None
    duration: Optional[int] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None
