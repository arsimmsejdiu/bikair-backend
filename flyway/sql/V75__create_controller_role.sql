insert into roles (name, description, active)
values ('CONTROLLER', 'Compte technicien', true);

insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'AVAILABLE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'MAINTENANCE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'BOOKED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'USED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'AVAILABLE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'MAINTENANCE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'PRIORITY_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'WORKSHOP_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'CONTROL_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'CONTROLLED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'BATTERY_LOW_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'CLIENT_REVIEW_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'CONTROLLER_REPORT');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'LOCK_ACCESS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'UPDATE_BIKE_STATUS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'CONTROLLER' and ar.name = 'REPORT_WRITE');
