alter table rentals drop column if exists start_time;
alter table rentals drop column if exists end_time;

alter table rentals add column if not exists start_time bigint not null;
alter table rentals add column if not exists end_time bigint not null;