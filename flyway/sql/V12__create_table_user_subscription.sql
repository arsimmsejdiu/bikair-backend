create table if not exists user_subscriptions
(
    id SERIAL PRIMARY KEY,
    user_id integer not null,
    payment_method_id integer not null,
    provider_subscription_id varchar(255) not null,
    product_id integer not null,
    city_id integer,
    status varchar(25) not null,
    canceled_note text,
    next_billing_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
