ALTER TABLE bikes ADD COLUMN IF NOT EXISTS spot_id INTEGER;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE city_spots ADD COLUMN IF NOT EXISTS max_bikes INTEGER;
CREATE INDEX IF NOT EXISTS city_spots_geo_idx ON city_spots USING gist(coordinates);

ALTER TABLE countries
DROP CONSTRAINT IF EXISTS countries_name_key;
ALTER TABLE countries
ADD CONSTRAINT countries_name_key UNIQUE(name);


INSERT INTO countries (name, phone_code, iso_2, locale, currency) 
VALUES ('Belgique', '+32', 'BE', 'fr', 'EUR')
ON CONFLICT ON CONSTRAINT countries_name_key 
DO NOTHING;

INSERT INTO countries (name, phone_code, iso_2, locale, currency) 
VALUES ('Italie', '+39', 'IT', 'it', 'EUR')
ON CONFLICT ON CONSTRAINT countries_name_key 
DO NOTHING;

COMMENT ON COLUMN city_spots.max_bikes IS 'The maximum number of bikes authorized on this spot';