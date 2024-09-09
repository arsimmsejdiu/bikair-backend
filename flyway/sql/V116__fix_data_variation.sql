update functionalities set global = false where name in ('PACK_MINUTES', 'PACK_TRIPS');

update products set type = 'PASS' where name = 'PACK_TRIPS';
update products set type = 'DISCOUNT' where name = 'PACK_MINUTES';

update discounts set product_id = null, status = 'INACTIVE' where id in (select discount_id from products);
update discounts set product_id = null, status = 'INACTIVE' where id in (select discount_id from product_variations);

update discounts set type = 'ONE_SHOT' where code = 'PACK_TRIP'
