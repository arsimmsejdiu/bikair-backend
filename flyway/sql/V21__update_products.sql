ALTER TABLE products rename column subscription to recurring;
ALTER TABLE products alter column duration set default 30;
ALTER TABLE products alter column duration set not null;
ALTER TABLE products alter column discount_id set not null;
ALTER TABLE products alter column status set default 'INACTIVE';
ALTER TABLE products alter column status set not null;
