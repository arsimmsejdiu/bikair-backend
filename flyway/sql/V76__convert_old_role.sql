update admins
set role_id = (select id from roles where name = 'ADMINISTRATOR')
where id in (select admin_id from admin_roles where role = 'SUPER_ADMIN');

update admins
set role_id = (select id from roles where name = 'TECHNICIAN')
where id in (select admin_id from admin_roles where role = 'TECHNICIAN');

update admins
set role_id = (select id from roles where name = 'MAINTAINER')
where id in (select admin_id from admin_roles where role = 'MAINTAINER');

update admins
set role_id = (select id from roles where name = 'CONTROLLER')
where id in (select admin_id from admin_roles where role = 'CONROLLER');

update admins
set role_id = (select id from roles where name = 'COLLECTOR')
where id in (select admin_id from admin_roles where role = 'COLLECTOR');