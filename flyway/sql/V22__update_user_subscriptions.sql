ALTER TABLE user_subscriptions alter column total_usage set not null;

DROP index if exists subscription_idx;
CREATE UNIQUE INDEX IF NOT EXISTS subscription_idx ON user_subscriptions (user_id) WHERE status in ('ACTIVE', 'UNPAID', 'CANCELED') AND next_billing_date IS NOT NULL;
