alter table rentals drop column if exists duration;
alter table rentals drop column if exists customer_address;
alter table rentals add column if not exists customer_address varchar(255);
alter table activation_codes add CONSTRAINT constraint_name UNIQUE (code);

DO $$
DECLARE accessRight1 integer;
DECLARE accessRight2 integer;
DECLARE adminRole integer;
DECLARE techRole integer;
BEGIN
    insert into access_rights (name, category, active, description) values ('RENTAL_READ', 'BIKE_STATUS_WRITE', true, 'Acceder au vélo en location');
    insert into access_rights (name, category, active, description) values ('RENTAL_WRITE', 'BIKE_STATUS_WRITE', true, 'Acceder au vélo en location');
    SELECT
        id
    FROM access_rights
    WHERE name = 'RENTAL_WRITE' INTO accessRight1;
    SELECT
        id
    FROM access_rights
    WHERE name = 'RENTAL_READ' INTO accessRight2;
    SELECT
        id
    FROM roles
    WHERE name = 'ADMINISTRATOR' INTO adminRole;
    SELECT
        id
    FROM roles
    WHERE name = 'TECHNICIAN' INTO techRole;

    insert into roles_access_rights (role_id, access_right_id) values (adminRole, accessRight1);
    insert into roles_access_rights (role_id, access_right_id) values (adminRole, accessRight2);
    insert into roles_access_rights (role_id, access_right_id) values (techRole, accessRight1);
    insert into roles_access_rights (role_id, access_right_id) values (techRole, accessRight2);
END $$;
