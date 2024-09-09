insert into access_rights (name, category, description)
values ('REVIEWS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Have Access to only read reviews');

insert into access_rights (name, category, description)
values ('REVIEWS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Gives you access to only write reviews');

insert into access_rights (name, category, description)
values ('ROLES_READ', 'BACKOFFICE_FUNCTIONALITY', 'Gives you access to only read roles');

insert into access_rights (name, category, description)
values ('ROLES_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Gives you access to only write roles');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'REVIEWS_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'REVIEWS_WRITE');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'ROLES_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'ROLES_WRITE');