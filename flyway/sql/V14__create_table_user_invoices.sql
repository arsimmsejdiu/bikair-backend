create table if not exists user_invoices
(
    id SERIAL PRIMARY KEY,
    subscription_id integer not null,
    amount integer not null,
    status varchar(25) not null,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
