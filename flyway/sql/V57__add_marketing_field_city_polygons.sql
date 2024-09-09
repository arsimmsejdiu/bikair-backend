alter table marketing_campaigns add column if not exists event_rule text;
alter table marketing_campaigns add column if not exists fn_arn text;
alter table marketing_campaigns add column if not exists uuid UUID DEFAULT uuid_generate_v4() NOT NULL;


CREATE TABLE IF NOT EXISTS city_polygons
(
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255),
    polygon       GEOMETRY,
    city_id       INTEGER not null,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
