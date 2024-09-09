insert into access_rights (name, category, description)
values ('INCIDENT_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');

insert into access_rights (name, category, description)
values ('INCIDENT_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'INCIDENT_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'INCIDENT_WRITE');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'TECHNICIAN' and ar.name = 'INCIDENT_READ');