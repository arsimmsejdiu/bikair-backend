
INSERT INTO discounts (code, value, type, reusable, status) VALUES ('PALLIER30', 30, 'PERCENT', false, 'ACTIVE');
INSERT INTO discounts (code, value, type, reusable, status) VALUES ('PALLIER60', 60, 'PERCENT', false, 'ACTIVE');
INSERT INTO discounts (code, value, type, reusable, status) VALUES ('PALLIER100', 100, 'PERCENT', false, 'ACTIVE');

create table if not exists games
(
    id SERIAL PRIMARY KEY,
    name varchar(255) not null,
    description JSON DEFAULT '{"en": {}, "fr": {}}',
    level integer default 3,
    to_be_reached integer default 5,
    discount_ids integer[] not null,
    status varchar(25) not null default 'ACTIVE',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


create table if not exists user_games
(
    id SERIAL PRIMARY KEY,
    user_id integer not null,
    game_id varchar(255) not null,
    current_level integer not null default 1,
    achieved integer not null default 0,
    started_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    total_played integer not null default 0,
    status varchar(100) not null,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


CREATE UNIQUE INDEX IF NOT EXISTS user_games_idx ON user_games (user_id) WHERE status = 'ACTIVE';

DO $$
DECLARE pallier30 integer;
DECLARE pallier60 integer;
DECLARE pallier100 integer;
BEGIN
    SELECT
        id
    FROM discounts
    WHERE code = 'PALLIER30' INTO pallier30;
    SELECT
        id
    FROM discounts
    WHERE code = 'PALLIER60' INTO pallier60;
    SELECT
        id
    FROM discounts
    WHERE code = 'PALLIER100' INTO pallier100;
    INSERT INTO games (name, description, level, discount_ids) VALUES ('PALLIER', '{
        "en": {
        "title": "Level",
        "description": "Go play!",
        "notifications": [
            "Congratulations, you made 5 trips in Bik''air! A 30% discount will be applied on your next trip 🙂",
            "Congratulations, you made 10 trips in Bik''air! A 60% discount will be applied on your next trip 🙂",
            "Congratulations, you made 10 trips in Bik''air! Your next trip is free (within 30 minutes 🙂)"
        ]
    },
        "fr": {
        "title": "Pallier",
        "description": "A vous de jouez !",
        "notifications": [
            "Félicitations, vous avez fait 5 trajets en Bik''air ! Une réduction de 30% sera appliqué sur votre prochain trajet 🙂",
            "Félicitations, vous avez fait 10 trajets en Bik''air ! Une réduction de 60% sera appliqué sur votre prochain trajet 🙂",
            "Félicitations, vous avez fait 10 trajets en Bik''air ! Votre prochain trajet est offert (dans la limite de 30 minutes 🙂"
        ]
        }
    }', 3, ARRAY[pallier30, pallier60, pallier100]);
END $$;
