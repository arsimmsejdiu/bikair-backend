insert into city_red_zones (name, city_id, status, polygon)
select 'Avenue de la Liberte', id, 'ACTIVE', ST_GeomFromText('POLYGON((7.1216297 43.6581059, 7.1217370 43.6578615, 7.1218175 43.6579352, 7.1218818 43.6580244, 7.1219194 43.6581214, 7.1219623 43.6582068, 7.1218604 43.6582843, 7.1217799 43.6582223, 7.1216297 43.6581059))')
from cities
where name = 'Villeneuve-Loubet';

delete from access_rights where name = 'POLYGON_READ';
insert into access_rights (name, category, description)
values ('POLYGON_READ', 'BACKOFFICE_FUNCTIONALITY', 'Have Access to only read polygons');

delete from access_rights where name = 'POLYGON_WRITE';
insert into access_rights (name, category, description)
values ('POLYGON_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Have Access to only write polygons');

delete from access_rights where name = 'RED_ZONE_READ';
insert into access_rights (name, category, description)
values ('RED_ZONE_READ', 'BACKOFFICE_FUNCTIONALITY', 'Have Access to only read red zones');

delete from access_rights where name = 'RED_ZONE_WRITE';
insert into access_rights (name, category, description)
values ('RED_ZONE_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Have Access to only write red zones');

