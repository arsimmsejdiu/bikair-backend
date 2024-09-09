insert into access_rights (name, category, description)
values ('BIKE_REPORT_HISTORY', 'TECH_APP_FUNCTIONALITY', 'Have Access to only read bike history reports');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'BIKE_REPORT_HISTORY');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'TECHNICIAN' and ar.name = 'BIKE_REPORT_HISTORY');
