create table if not exists battery_history
(
    id            serial primary key,
    battery_id    integer                                not null,
    full_capacity integer                                not null,
    capacity      integer                                not null,
    voltage       numeric(5, 2)                          not null,
    soc           integer                                not null,
    is_charging   boolean                  default false,
    serial        varchar(100),
    status        varchar(100),
    created_at    timestamp with time zone default now() not null,
    updated_at    timestamp with time zone default now() not null
);
