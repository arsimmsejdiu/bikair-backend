insert into access_rights (name, category, active, description)
values ('BATTERY_READ', 'BIKE_STATUS_READ', true, 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, active, description)
values ('BATTERY_WRITE', 'BIKE_STATUS_WRITE', true, 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, active, description)
values ('WAIT_MISSING_PART_READ', 'BIKE_STATUS_READ', true, 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, active, description)
values ('WAIT_MISSING_PART_WRITE', 'BIKE_STATUS_WRITE', true, 'Permission de modifier les vélo pour y affecter ce status');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'BATTERY_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'BATTERY_WRITE');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'WAIT_MISSING_PART_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'WAIT_MISSING_PART_WRITE');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'TECHNICIAN' and ar.name = 'BATTERY_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'TECHNICIAN' and ar.name = 'BATTERY_WRITE');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'TECHNICIAN' and ar.name = 'WAIT_MISSING_PART_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'TECHNICIAN' and ar.name = 'WAIT_MISSING_PART_WRITE');
