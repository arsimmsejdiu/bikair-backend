alter table products
    add column if not exists discount_type varchar(100) not null default 'ONE_SHOT';
alter table products
    add column if not exists discount_value integer not null default 0;

update products
set discount_type  = subquery.type,
    discount_value = subquery.value
from (select id, type, value from discounts) as subquery
where products.discount_id = subquery.id;

alter table product_variations
    add column if not exists discount_type varchar(100) not null default 'ONE_SHOT';
alter table product_variations
    add column if not exists discount_value integer not null default 0;

update product_variations
set discount_type  = subquery.type,
    discount_value = subquery.value
from (select id, type, value from discounts) as subquery
where product_variations.discount_id = subquery.id;

alter table user_subscriptions
    add column if not exists price integer not null default 0;
alter table user_subscriptions
    add column if not exists discount_id integer not null default 0;
alter table user_subscriptions
    add column if not exists max_usage integer not null default 0;
alter table user_subscriptions
    add column if not exists discount_type varchar(100) not null default 'ONE_SHOT';
alter table user_subscriptions
    add column if not exists discount_value integer not null default 0;
alter table user_subscriptions
    add column if not exists recurring boolean not null default false;
alter table user_subscriptions
    add column if not exists name varchar(255) not null default 'PRODUCT';

update user_subscriptions
set price          = subquery.price,
    discount_id    = subquery.discount_id,
    max_usage      = subquery.max_usage,
    recurring      = subquery.recurring,
    discount_type  = subquery.discount_type,
    discount_value = subquery.discount_value,
    name           = subquery.name
from (select id,
             price,
             discount_id,
             max_usage,
             recurring,
             discount_type,
             discount_value,
             name
      from products) as subquery
where user_subscriptions.product_id = subquery.id;

update user_subscriptions
set price          = subquery.price,
    discount_id    = subquery.discount_id,
    max_usage      = subquery.max_usage,
    discount_type  = subquery.discount_type,
    discount_value = subquery.discount_value
from (select id,
             price,
             discount_id,
             max_usage,
             discount_type,
             discount_value
      from product_variations) as subquery
where user_subscriptions.product_variation_id = subquery.id;

