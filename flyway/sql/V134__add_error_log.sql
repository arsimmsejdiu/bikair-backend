create table if not exists error_logs
(
    id SERIAL PRIMARY KEY,
    message TEXT,
    request TEXT,
    user_id integer,
    trip_id integer,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
