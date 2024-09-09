ALTER TABLE products DROP column max_daily_usage;
ALTER TABLE products ADD column max_usage INTEGER NOT NULL DEFAULT 2;
ALTER TABLE products ADD column period VARCHAR(50) NOT NULL DEFAULT '1 day';

create table if not exists functionalities
(
    id SERIAL PRIMARY KEY,
    name varchar(255) not null,
    description text,
    context text not null,
    active boolean default true,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

create table if not exists city_functionalities
(
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL,
    functionality_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

