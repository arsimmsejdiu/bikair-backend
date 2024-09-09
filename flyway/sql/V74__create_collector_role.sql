insert into roles (name, description, active)
values ('COLLECTOR', 'Compte technicien', true);

insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'AVAILABLE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'MAINTENANCE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'BOOKED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'USED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'AVAILABLE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'MAINTENANCE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'PRIORITY_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'WORKSHOP_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'COLLECT_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'COLLECTED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'BATTERY_LOW_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'CLIENT_REVIEW_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'COLLECTOR_REPORT');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'LOCK_ACCESS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'UPDATE_BIKE_STATUS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'COLLECTOR' and ar.name = 'REPORT_WRITE');
