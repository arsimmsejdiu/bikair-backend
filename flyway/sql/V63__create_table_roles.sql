create table if not exists roles
(
    id SERIAL PRIMARY KEY,
    name varchar(50) not null,
    description text,
    active boolean not null default true,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
