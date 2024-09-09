UPDATE discounts SET product_id = (select id from products where name = 'PACK_TRIPS') WHERE code = 'PACK_TRIP';
UPDATE discounts SET product_id = (select id from products where name = 'PACK_MINUTES') WHERE code = 'PACK_60';
UPDATE discounts SET product_id = (select id from products where name = 'PACK_MINUTES') WHERE code = 'PACK_120';
UPDATE discounts SET product_id = (select id from products where name = 'PACK_MINUTES') WHERE code = 'PACK_240';

