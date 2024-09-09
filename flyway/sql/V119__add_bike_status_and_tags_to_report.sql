alter table reports add column if not exists bike_status varchar(100) default 'UNKNOWN' not null;
alter table reports add column if not exists bike_tags character varying[] default ARRAY []::character varying[] not null;

