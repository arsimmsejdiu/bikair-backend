insert into access_rights (name, category, description)
values ('CAUTIONS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Have Access to only read cautions');

insert into access_rights (name, category, description)
values ('CAUTIONS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Have Access to only write cautions');

insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'CAUTIONS_READ');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
     from roles r, access_rights ar
     where r.name = 'ADMINISTRATOR' and ar.name = 'CAUTIONS_WRITE');
