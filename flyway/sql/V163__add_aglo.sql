ALTER TABLE cities ADD column IF NOT EXISTS agglomeration VARCHAR(255) NOT NULL DEFAULT 'OTHER';
-- INSERT INTO cities (name, status) VALUES ('Atelier', 'INACTIVE');
