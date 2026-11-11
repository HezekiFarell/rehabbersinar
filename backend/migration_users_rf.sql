-- Jalankan pada database PostgreSQL yang digunakan aplikasi.
-- Jangan hapus kolom lama. Kolom lama dipertahankan untuk kompatibilitas.

ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS minat_edukasi VARCHAR;

ALTER TABLE users ADD COLUMN IF NOT EXISTS p1 INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS p2 INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS p3 INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS p4 INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS p5 INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS p6 INTEGER;

-- Validasi nilai P1-P6 jika database mendukung constraint tambahan:
-- ALTER TABLE users ADD CONSTRAINT users_p1_check CHECK (p1 BETWEEN 1 AND 5);
-- ... ulangi untuk p2 sampai p6 bila diperlukan.
