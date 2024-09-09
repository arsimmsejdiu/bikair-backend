create table if not exists external_accounts
(
    id         serial primary key,
    uuid       uuid                     default uuid_generate_v4() not null,
    company    varchar(100) unique,
    name       varchar(100),
    email      varchar(100) unique,
    phone      varchar(15) unique,
    locale     varchar(2),
    login      varchar(100),
    password   text,
    created_at timestamp with time zone default now()              not null,
    updated_at timestamp with time zone default now()              not null
);
