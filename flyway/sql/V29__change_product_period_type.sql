alter table products add column IF NOT EXISTS period_new integer not null default 30;

update products set period_new = cast(split_part(period, ' ', 1) as integer);

alter table products drop column if exists period;

alter table products rename column period_new to period;
