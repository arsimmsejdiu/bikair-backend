alter table marketing_campaigns add column if not exists status varchar(20) not null default 'INACTIVE';
