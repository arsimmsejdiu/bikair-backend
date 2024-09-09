alter table rental_orders drop column if exists start_time;
alter table rental_orders drop column if exists end_time;
alter table rental_orders add column if not exists start_time bigint not null;
alter table rental_orders add column if not exists end_time bigint not null;