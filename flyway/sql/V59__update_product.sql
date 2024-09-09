alter table products add column if not exists recurence varchar(15);
alter table ip_mapping add column if not exists permanent boolean default false;

CREATE TABLE IF NOT EXISTS batches
(
    id            SERIAL PRIMARY KEY,
    name          varchar(50)  not null,
    uuid UUID     NOT NULL DEFAULT uuid_generate_v4(),
    frequency     varchar(100) not null,
    fn_arn        text         not null,
    request       text,
    event_rule    text,
    status        varchar(100) not null default 'INACTIVE',
    type          varchar(100) not null default 'SELECT',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
