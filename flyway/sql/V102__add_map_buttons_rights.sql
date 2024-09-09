insert into access_rights (name, category, description, active)
values ('FILTER_STATUS', 'TECH_APP_FUNCTIONALITY', 'Accès au filtre sur le status dans l''application technicien', true);
insert into access_rights (name, category, description, active)
values ('FILTER_TAGS', 'TECH_APP_FUNCTIONALITY', 'Accès au filtre sur le tag dans l''application technicien', true);
insert into access_rights (name, category, description, active)
values ('LOCK_GPS', 'TECH_APP_FUNCTIONALITY', 'Accès au vérouillage sur la position', true);
insert into access_rights (name, category, description, active)
values ('REFRESH_DATA', 'TECH_APP_FUNCTIONALITY', 'Accès au bouton pour forcer à rafraichir toutes les données', true);

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'REFRESH_DATA');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'CONTROLLER'
       and ar.name = 'REFRESH_DATA');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'COLLECTOR'
       and ar.name = 'REFRESH_DATA');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'TECHNICIAN'
       and ar.name = 'REFRESH_DATA');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'MAINTAINER'
       and ar.name = 'REFRESH_DATA');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ADMINISTRATOR'
       and ar.name = 'REFRESH_DATA');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'LOCK_GPS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'CONTROLLER'
       and ar.name = 'LOCK_GPS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'COLLECTOR'
       and ar.name = 'LOCK_GPS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'TECHNICIAN'
       and ar.name = 'LOCK_GPS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'MAINTAINER'
       and ar.name = 'LOCK_GPS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ADMINISTRATOR'
       and ar.name = 'LOCK_GPS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'TECHNICIAN'
       and ar.name = 'FILTER_TAGS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'MAINTAINER'
       and ar.name = 'FILTER_TAGS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ADMINISTRATOR'
       and ar.name = 'FILTER_TAGS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'TECHNICIAN'
       and ar.name = 'FILTER_STATUS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'MAINTAINER'
       and ar.name = 'FILTER_STATUS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ADMINISTRATOR'
       and ar.name = 'FILTER_STATUS');
