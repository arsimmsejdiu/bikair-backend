create table if not exists products
(
    id SERIAL PRIMARY KEY,
    name varchar(255) not null,
    subscription boolean not null default false,
    price integer not null,
    duration integer,
    provider_id varchar(255),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
