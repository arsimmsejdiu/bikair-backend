update functionalities set global = false where name = 'SPOT_PARKING';

insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Narbonne' and f.name = 'SPOT_PARKING');
