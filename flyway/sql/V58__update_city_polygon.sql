alter table city_polygons add column if not exists status varchar(100);

insert into city_polygons (name, polygon, city_id, status)
(select name, polygon, id, status from cities);
