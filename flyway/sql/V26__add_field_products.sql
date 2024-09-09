alter table trips add column IF NOT EXISTS user_subscription_id integer default NULL;

delete from functionalities where name = 'ZENDESK';
insert into functionalities (name, context, global) values ('ZENDESK', 'MOBILE_APP', TRUE);

delete from functionalities where name = 'APPLE_PAY';
insert into functionalities (name, context, global) values ('APPLE_PAY', 'MOBILE_APP', TRUE);

delete from functionalities where name = 'GOOGLE_PAY';
insert into functionalities (name, context, global) values ('GOOGLE_PAY', 'MOBILE_APP', TRUE);
