alter table user_notifications
    add column if not exists uuid uuid default uuid_generate_v4() not null;
