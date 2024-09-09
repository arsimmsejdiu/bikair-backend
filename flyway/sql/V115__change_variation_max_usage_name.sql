alter table product_variations add column if not exists max_usage INTEGER;
update product_variations set max_usage = total_usage;
alter table product_variations alter column max_usage set not null;
alter table product_variations drop column if exists total_usage;

