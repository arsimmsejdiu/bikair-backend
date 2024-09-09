ALTER TABLE discounts
DROP CONSTRAINT IF EXISTS discounts_code_key;
ALTER TABLE discounts
ADD CONSTRAINT discounts_code_key UNIQUE(code);


INSERT INTO discounts (code, type, value, reusable, status) 
VALUES ('NOUVEAUTRAJET', 'PERCENT', 30, false, 'ACTIVE')
ON CONFLICT ON CONSTRAINT discounts_code_key 
DO NOTHING;

INSERT INTO discounts (code, type, value, reusable, status) 
VALUES ('TRAJETGRATUIT', 'ONE_SHOT', 15, false, 'ACTIVE')
ON CONFLICT ON CONSTRAINT discounts_code_key 
DO NOTHING;
