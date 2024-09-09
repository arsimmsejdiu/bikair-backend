create table if not exists product_variations
(
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER NOT NULL,
    description JSON NOT NULL,
    price       INTEGER NOT NULL,
    status      VARCHAR(30) NOT NULL DEFAULT 'INACTIVE',
    total_usage INTEGER  NOT NULL,
    discount_id INTEGER  NOT NULL,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

DO $$
DECLARE prodid1 integer;
DECLARE prodid2 integer;
DECLARE discount1 integer;
DECLARE discount2 integer;
DECLARE discount3 integer;
DECLARE discount4 integer;
BEGIN

    INSERT INTO discounts (code, type, value, reusable, status) VALUES ('PACK_60', 'PACK', 60, true, 'INACTIVE') RETURNING id INTO discount1; 
    INSERT INTO discounts (code, type, value, reusable, status) VALUES ('PACK_120', 'PACK', 120, true, 'INACTIVE') RETURNING id INTO discount2; 
    INSERT INTO discounts (code, type, value, reusable, status) VALUES ('PACK_240', 'PACK', 240, true, 'INACTIVE') RETURNING id INTO discount3; 

    INSERT INTO discounts (code, type, value, reusable, status) VALUES ('PACK_TRIP', 'PACK', 30, true, 'INACTIVE') RETURNING id INTO discount4; 


    INSERT INTO products (name, recurring, price, duration, provider_id, status, price_id, discount_id, max_usage, description, type) 
        VALUES ('PACK_MINUTES', False, 0, 30, 'PACK_MINUTES', 'ACTIVE', 'PACK_MINUTES', discount1, 2, '
        {"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}
        ', 'PASS'
        ) RETURNING id INTO prodid1;

    INSERT INTO product_variations (product_id, description, price,status,total_usage,discount_id) 
        VALUES (prodid1,
        '{"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}'
        , 700, 'ACTIVE', 1, discount1);
    INSERT INTO product_variations (product_id, description, price,status,total_usage,discount_id) 
        VALUES (prodid1,
        '{"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}'
        , 1500, 'ACTIVE', 1, discount2);
    INSERT INTO product_variations (product_id, description, price,status,total_usage,discount_id) 
        VALUES (prodid1,
        '{"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}'
        , 2800, 'ACTIVE', 1, discount3);

    INSERT INTO products (name, recurring, price, duration, provider_id, status, price_id, discount_id, max_usage, description, type) 
        VALUES ('PACK_TRIPS', False, 0, 30, 'PACK_TRIPS', 'ACTIVE', 'PACK_TRIPS', discount4, 2,
        '{"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}',
         'PASS') RETURNING id INTO prodid2;

    INSERT INTO product_variations (product_id, description, price,status,total_usage,discount_id) 
        VALUES (prodid2,
        '{"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}'
        , 999, 'ACTIVE', 5, discount4);
    INSERT INTO product_variations (product_id, description, price,status,total_usage,discount_id) 
        VALUES (prodid2,
        '{"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}'
        , 1999, 'ACTIVE', 10, discount4);
    INSERT INTO product_variations (product_id, description, price,status,total_usage,discount_id) 
        VALUES (prodid2,
        '{"en": {
            "name":"Product pack minutes",
            "frequency":"2 trips",
            "description":"A round trip on Bik Air? Take advantage of our 2-trip pass for a stress-free use of the meter.",
            "describe":[
                "No stress, take your time to ride",
                "Save up to 3€ per trip","30 minutes per trip, this is huuuge!",
                "Enjoy your 2 trips for 1 month"],
            "obligation":null,"success_message":"Your purchase is confirmed. You can use your 2-trip pass until"},
        "fr":{
            "name":"Produit pack minutes",
            "description":"Un aller-retour avec Bik Air ? Privilégiez notre pass 2 trajets pour une utilisation sans stress de compteur.",
            "describe":[
                "Pas de stress, prenez votre temps pour rouler",
                "Economisez jusqu a 3€ par trajet","30 minutes par trajet, vous êtes laaaarge !",
                "Profitez de vos 2 trajets pendant 1 mois"],
                "obligation":null,
                "success_message":"Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu au"
        }}'
        , 2999, 'ACTIVE', 20, discount4);

    INSERT INTO functionalities (name, context, global, active) VALUES ('PACK_MINUTES','MOBILE_APP', true, true); 
    INSERT INTO functionalities (name, context, global, active) VALUES ('PACK_TRIPS','MOBILE_APP', true, true); 

END $$;
