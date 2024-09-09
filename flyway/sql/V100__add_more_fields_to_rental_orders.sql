alter table rental_orders add column if not exists provider_id varchar(255) not null default '';
alter table rental_orders add column if not exists shipping_address text;
alter table rental_orders add column if not exists withdrawal_address text;
