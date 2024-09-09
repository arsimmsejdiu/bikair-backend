create table if not exists city_red_zones
(
    id SERIAL PRIMARY KEY,
    name varchar(255) not null,
    city_id integer not null,
    polygon GEOMETRY,
    status varchar(255) not null,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
