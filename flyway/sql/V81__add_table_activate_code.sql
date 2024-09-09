CREATE TABLE IF NOT EXISTS activation_codes
(
    id SERIAL PRIMARY KEY,
    code varchar(255) not null,
    email varchar(255),
    target_id integer not null,
    used boolean not null default false,
    payment_id varchar(255),
    type varchar(255) not null,
    price integer,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

alter table products add column if not exists type varchar(255) not null default 'SUBSCRITPION';

CREATE TABLE IF NOT EXISTS rentals
(
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ  NOT NULL,
    end_time TIMESTAMPTZ  NOT NULL,
    duration integer not null,
    customer_email varchar(255) not null,
    customer_address varchar(255) not null,
    user_id integer,
    status varchar(255) not null default 'CREATED',
    city_id integer not null,
    shipping boolean not null default false,
    withdrawal boolean not null default false,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
)
