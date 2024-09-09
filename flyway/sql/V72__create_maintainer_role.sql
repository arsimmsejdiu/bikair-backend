insert into roles (name, description, active)
values ('MAINTAINER', 'Compte mainteneur', true);

insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'AVAILABLE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'MAINTENANCE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'AVAILABLE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'MAINTENANCE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'COLLECTOR_REPORT');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'CONTROLLER_REPORT');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'LOCK_ACCESS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'MAINTAINER' and ar.name = 'UPDATE_BIKE_STATUS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'TECHNICIAN' and ar.name = 'UPDATE_BIKE_ADDRESS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'TECHNICIAN' and ar.name = 'REPORT_WRITE');