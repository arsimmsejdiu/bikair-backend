create table if not exists roles_access_rights
(
    id SERIAL PRIMARY KEY,
    role_id integer not null,
    access_right_id integer not null,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
