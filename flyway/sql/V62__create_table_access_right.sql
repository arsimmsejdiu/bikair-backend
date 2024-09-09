create table if not exists access_rights
(
    id SERIAL PRIMARY KEY,
    name varchar(50) not null,
    category varchar(50) not null,
    description text not null,
    active boolean not null default true,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
