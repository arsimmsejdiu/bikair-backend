insert into functionalities (name, description, context, active, global)
values ('END_PHOTO', 'Photo de fin de trajet', 'MOBILE_APP', true, false);

insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Bourges' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Nevers-old' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Gimouille' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Nevers' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Challuy' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Sermoise sur loire' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Saincaize-Meauce' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Fourchambault' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Coulanges-les-Nevers' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Varennes vauzelles' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Garchizy' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Germigny sur loire' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Pougues les eaux' and f.name = 'END_PHOTO');
insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Parigny-les-Vaux' and f.name = 'END_PHOTO');

update users set score = 0.5;
