insert into access_rights (name, category, description, active)
values ('ITINERANT_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag', true);
insert into access_rights (name, category, description, active)
values ('ITINERANT_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag', true);
insert into access_rights (name, category, description, active)
values ('ITINERANT_DONE_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag', true);
insert into access_rights (name, category, description, active)
values ('ITINERANT_DONE_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag', true);

insert into roles (name, description, active)
values ('ITINERANT', 'Technicien itinerant', true);

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'MAINTENANCE_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'PRIORITY_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'WORKSHOP_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'ITINERANT_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'ITINERANT_DONE_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'CONTROLLER_REPORT');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'LOCK_ACCESS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'SPOT_ACCESS');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'SPOT_NUMBER');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r,
          access_rights ar
     where r.name = 'ITINERANT'
       and ar.name = 'CITY_RED_ZONE');

