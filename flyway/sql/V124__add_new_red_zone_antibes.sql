insert into city_red_zones (name, city_id, status, polygon)
select 'Golfe-Juan', id, 'ACTIVE', ST_GeomFromText('POLYGON((7.0778239 43.5668582, 7.0778346 43.5668660, 7.0750666 43.5663296, 7.0734358 43.5656766, 7.0719123 43.5649847, 7.0724487 43.5641295, 7.0729637 43.5634765, 7.0757318 43.5634454, 7.0760107 43.5620771, 7.0772123 43.5620460, 7.0788860 43.5625591, 7.0817184 43.5641762, 7.0847869 43.5661819, 7.0845938 43.5673168, 7.0845294 43.5682652, 7.0830274 43.5692292, 7.0825875 43.5692836, 7.0821476 43.5690815, 7.0813751 43.5687083, 7.0801735 43.5680476, 7.0778239 43.5668582))')
from cities
where name = 'Antibes-Juan-les-Pins';


