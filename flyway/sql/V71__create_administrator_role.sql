insert into roles (name, description, active)
values ('ADMINISTRATOR', 'Compte administrateur', true);

insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'AVAILABLE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'MAINTENANCE_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'BOOKED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'USED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'STOLEN_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'NOT_FOUND_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'PREPARATION_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'WAIT_DEPLOY_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'DAMAGED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'AVAILABLE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'MAINTENANCE_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'BOOKED_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'USED_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'STOLEN_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'NOT_FOUND_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'PREPARATION_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'WAIT_DEPLOY_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'DAMAGED_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'PRIORITY_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'WORKSHOP_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'TO_SPOT_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CONTROL_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CONTROLLED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'COLLECT_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'COLLECTED_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'BATTERY_LOW_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CLIENT_REVIEW_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'PRIORITY_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'WORKSHOP_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'TO_SPOT_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CONTROL_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CONTROLLED_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'COLLECT_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'COLLECTED_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'BATTERY_LOW_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CLIENT_REVIEW_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'COLLECTOR_REPORT');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CONTROLLER_REPORT');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'UPDATE_BIKE_TRACKER');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'UPDATE_BIKE_LOCK');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'CREATE_BIKE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'LOCK_ACCESS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'UPDATE_BIKE_CITY');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'UPDATE_BIKE_STATUS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'UPDATE_BIKE_TAGS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'BACKOFFICE_ACCESS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'ADMINS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'ADMINS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'SPOTS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'SPOTS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'REPORTS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'REPORTS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'DISCOUNTS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'DISCOUNTS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'MARKETINGS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'MARKETINGS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'RATES_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'RATES_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'BIKES_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'BIKES_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'SUBSCRIPTIONS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'SUBSCRIPTIONS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'USERS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'USERS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'TRIPS_READ');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'TRIPS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'UPDATE_BIKE_ADDRESS');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'REPORT_WRITE');
insert into roles_access_rights (role_id, access_right_id)
(select r.id, ar.id
 from roles r, access_rights ar
 where r.name = 'ADMINISTRATOR' and ar.name = 'UPDATE_BIKE_PARTS');
