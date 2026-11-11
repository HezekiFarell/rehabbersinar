from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String, nullable=False)
    password = Column(String, nullable=False)
    usia = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)

    # Feature utama Random Forest
    status = Column(String, nullable=True)
    minat_edukasi = Column(String, nullable=True)
    p1 = Column(Integer, nullable=True)
    p2 = Column(Integer, nullable=True)
    p3 = Column(Integer, nullable=True)
    p4 = Column(Integer, nullable=True)
    p5 = Column(Integer, nullable=True)
    p6 = Column(Integer, nullable=True)

    # Dipertahankan agar sistem lama tidak langsung rusak
    pendidikan = Column(String, nullable=True)
    kecamatan = Column(String, nullable=False)

    informed_consent = Column(Boolean, default=False)
    pretest_answers = Column(JSON, nullable=True)
    pretest_score = Column(Integer, nullable=True)

    # Preferensi tampilan/belajar, bukan target RF
    preferensi_format = Column(String, nullable=True)
    preferensi_waktu = Column(Integer, nullable=True)
    preferensi_topik = Column(String, nullable=True)

    group = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_admin = Column(Boolean, default=False)


class Materi(Base):
    __tablename__ = "materi"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    icon = Column(String, nullable=True)
    description = Column(String, nullable=True)
    fullDescription = Column(String, nullable=True)
    videoUrl = Column(String, nullable=True)
    imageUrl = Column(String, nullable=True)
    category = Column(String, nullable=True)
    content = Column(Text, nullable=True)
    sources = Column(JSON, nullable=True)


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    materi_id = Column(Integer, ForeignKey("materi.id"), nullable=False)
    action = Column(String, nullable=False)
    duration = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class PostTest(Base):
    __tablename__ = "posttests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    answers = Column(JSON, nullable=False)
    score = Column(Integer, nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
