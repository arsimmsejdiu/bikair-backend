insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
    from roles r, access_rights ar
    where r.name = 'ADMINISTRATOR' and ar.name = 'TECHNICIAN_REPORT');
insert into roles_access_rights (role_id, access_right_id)
    (select r.id, ar.id
    from roles r, access_rights ar
    where r.name = 'TECHNICIAN' and ar.name = 'TECHNICIAN_REPORT');
    
