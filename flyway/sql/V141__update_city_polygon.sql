insert into city_polygons (name, polygon, city_id, status)
    (select name, polygon, id, status from cities);
