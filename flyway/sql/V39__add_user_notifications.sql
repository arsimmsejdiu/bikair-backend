create table if not exists user_notifications
(
    id SERIAL PRIMARY KEY,
    title varchar(255),
    message TEXT,
    read boolean default false,
    redirect_to varchar(255) DEFAULT 'Map',
    type varchar(255),
    user_id integer not null,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE city_spots add column if not exists app_client boolean default false;
ALTER TABLE city_spots add column if not exists app_tech boolean default false;

