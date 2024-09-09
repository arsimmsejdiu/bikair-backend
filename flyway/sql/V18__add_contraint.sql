INSERT INTO discounts (type, code, value, status, reusable) VALUES ('SUBSCRIPTION','SUBSCRIPTION', 30, 'INACTIVE', true);
INSERT INTO discounts (type, code, value, status, reusable) VALUES ('PASS','PASS', 30, 'INACTIVE', true);

ALTER TABLE user_invoices ADD column IF NOT EXISTS provider_invoice_id VARCHAR(255);
ALTER TABLE user_subscriptions DROP column daily_usage;

CREATE UNIQUE INDEX IF NOT EXISTS subscription_idx ON user_subscriptions (user_id) WHERE status = 'ACTIVE' AND next_billing_date IS NOT NULL;
