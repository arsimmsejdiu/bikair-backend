CREATE OR REPLACE FUNCTION random_reference() 
    RETURNS TEXT AS
$$
BEGIN
    RETURN (select UPPER(CONCAT(substr(md5(random()::text), 0, 4),'-', substr(md5(random()::text), 0, 4), '-', substr(md5(random()::text), 0, 4))));
END;
$$ language 'plpgsql' STRICT;


ALTER TABLE ONLY discounts ALTER COLUMN code SET DEFAULT random_reference();
