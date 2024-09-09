insert into functionalities (name, description, context, active, global)
values ('END_TRIP_GAME', 'Jeux des codes promo en fin de trajet', 'MOBILE_APP', true, true);

insert into functionalities (name, description, context, active, global)
values ('SPOT_PARKING_PROMO', 'Code promo si on se gare sur un spot ou notif si on y est pas', 'MOBILE_APP', true, false);

insert into city_functionalities (city_id, functionality_id) (select c.id, f.id from cities c, functionalities f where c.name = 'Narbonne' and f.name = 'SPOT_PARKING_PROMO');
