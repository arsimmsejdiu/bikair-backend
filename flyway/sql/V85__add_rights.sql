insert into access_rights (name, category, description)
values ('SPOT_ACCESS', 'TECH_APP_FUNCTIONALITY', 'Pour avoir accès au spot, cache le bouton du filtre si on a pas ce access_right');

insert into access_rights (name, category, description)
values ('SPOT_ZONE', 'TECH_APP_FUNCTIONALITY', 'pour afficher la zone autour d un spot');

insert into access_rights (name, category, description)
values ('SPOT_NUMBER', 'TECH_APP_FUNCTIONALITY', 'pour afficher le compte de vélo sur un spot');

insert into access_rights (name, category, description)
values ('CITY_RED_ZONE', 'TECH_APP_FUNCTIONALITY', 'pour afficher les zone d exclusion des ville');


insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
    from roles r, access_rights ar
    where r.name = 'ADMINISTRATOR' and ar.name = 'CITY_RED_ZONE');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
    from roles r, access_rights ar
    where r.name = 'ADMINISTRATOR' and ar.name = 'SPOT_NUMBER');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
    from roles r, access_rights ar
    where r.name = 'ADMINISTRATOR' and ar.name = 'SPOT_ZONE');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
    from roles r, access_rights ar
    where r.name = 'ADMINISTRATOR' and ar.name = 'SPOT_ACCESS');
