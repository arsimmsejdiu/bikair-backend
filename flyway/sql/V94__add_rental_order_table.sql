create table if not exists rental_orders
(
    id         SERIAL PRIMARY KEY,
    uuid       uuid                  default uuid_generate_v4() not null,
    start_time TIMESTAMPTZ  NOT NULL,
    end_time   TIMESTAMPTZ  NOT NULL,
    firstname  varchar(255) not null,
    lastname   varchar(255) not null,
    email      varchar(255) not null,
    address    text,
    status     varchar(255) not null,
    city_id    integer      not null,
    shipping   boolean      not null default false,
    withdrawal boolean      not null default false,
    nb_bikes   integer      not null,
    price      integer      not null,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
)