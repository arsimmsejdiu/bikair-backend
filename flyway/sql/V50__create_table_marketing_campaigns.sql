CREATE TABLE IF NOT EXISTS marketing_campaigns
(
    id            SERIAL PRIMARY KEY,
    name          varchar(50)  not null,
    frequency     varchar(100) not null,
    title         jsonb         not null,
    message       jsonb         not null,
    configuration jsonb         not null,
    request       text         not null,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
