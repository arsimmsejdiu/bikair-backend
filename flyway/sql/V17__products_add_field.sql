ALTER TABLE products ADD column IF NOT EXISTS max_daily_usage INTEGER DEFAULT 2;
ALTER TABLE products ADD column IF NOT EXISTS description TEXT;
ALTER TABLE products ADD column IF NOT EXISTS status VARCHAR(255);


ALTER TABLE products DROP column price_id;
ALTER TABLE products ADD column price_id VARCHAR(255);

ALTER TABLE products DROP CONSTRAINT IF EXISTS unique_price_id;
ALTER TABLE products ADD CONSTRAINT unique_price_id UNIQUE (price_id);

ALTER TABLE products DROP CONSTRAINT IF EXISTS unique_name;
ALTER TABLE products ADD CONSTRAINT unique_name UNIQUE (name);


ALTER TABLE user_subscriptions ADD column IF NOT EXISTS daily_usage INTEGER DEFAULT 0;
ALTER TABLE user_subscriptions ADD column IF NOT EXISTS total_usage INTEGER DEFAULT 0;
