alter table marketing_campaigns add column if not exists replacements jsonb not null default '{}'::jsonb;
alter table marketing_campaigns add column if not exists date_end bigint;
