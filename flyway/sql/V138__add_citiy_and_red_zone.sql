delete from city_red_zones where name in ('Vieux port + Port garavan', 'Marina');

insert into city_red_zones (name, city_id, status, polygon)
select 'Vieille Ville Antibes', id, 'ACTIVE', ST_GeomFromText('POLYGON((7.1233463 43.5830405, 7.1231067 43.5825877, 7.1228993 43.5821214, 7.1225810 43.5814142, 7.1222591 43.5807069, 7.1226132 43.5803736, 7.1228170 43.5800785, 7.1225166 43.5797367, 7.1227098 43.5795269, 7.1235037 43.5793405, 7.1239150 43.5785016, 7.1242905 43.5777248, 7.1245801 43.5778879, 7.1248412 43.5780048, 7.1251059 43.5780277, 7.1253419 43.5775411, 7.1256495 43.5776382, 7.1259606 43.5777141, 7.1262503 43.5779665, 7.1263361 43.5782229, 7.1270657 43.5781297, 7.1273983 43.5780688, 7.1283048 43.5792146, 7.1290791 43.5802451, 7.1301913 43.5813249, 7.1308476 43.5824123, 7.1299392 43.5830247, 7.1288180 43.5830790, 7.1280348 43.5831606, 7.1279579 43.5830363, 7.1267402 43.5831606, 7.1257532 43.5832450, 7.1249592 43.5832588, 7.1233463 43.5830405))')
from cities
where name = 'Antibes-Juan-les-Pins';

insert into city_red_zones (name, city_id, status, polygon)
select 'Vieux port + Port garavan', id, 'ACTIVE', ST_GeomFromText('POLYGON((7.5090301 43.7745564, 7.5110793 43.7750984, 7.5126958 43.7759862, 7.5133288 43.7768611, 7.5129104 43.7778134, 7.5129783 43.7791528, 7.5136864 43.7804999, 7.5160861 43.7813360, 7.5194049 43.7818289, 7.5219798 43.7824792, 7.5226235 43.7833153, 7.5218725 43.7839037, 7.5214291 43.7845385, 7.5206244 43.7844611, 7.5199485 43.7843991, 7.5192940 43.7843295, 7.5183606 43.7841183, 7.5173950 43.7839192, 7.5164044 43.7836768, 7.5164080 43.7836869, 7.5156140 43.7835011, 7.5144768 43.7832069, 7.5140333 43.7830649, 7.5136256 43.7828741, 7.5142479 43.7816122, 7.5137651 43.7814573, 7.5131321 43.7821076, 7.5127888 43.7819605, 7.5120163 43.7816431, 7.5119090 43.7817051, 7.5117373 43.7818599, 7.5114942 43.7820941, 7.5110328 43.7818695, 7.5105554 43.7816410, 7.5102603 43.7814705, 7.5099707 43.7812924, 7.5096649 43.7810678, 7.5094020 43.7807928, 7.5090426 43.7803938, 7.5086617 43.7800569, 7.5083828 43.7798206, 7.5081468 43.7795689, 7.5079215 43.7793132, 7.5077015 43.7790808, 7.5075728 43.7789220, 7.5075164 43.7787768, 7.5074896 43.7787071, 7.5074789 43.7786316, 7.5075138 43.7785025, 7.5077605 43.7776792, 7.5081629 43.7768111, 7.5086868 43.7759062, 7.5086224 43.7752171, 7.5090408 43.7746983, 7.5090301 43.7745564))')
from cities
where name = 'Menton';

insert into city_red_zones (name, city_id, status, polygon)
select 'Marina', id, 'ACTIVE', ST_GeomFromText('POLYGON((7.0725185 43.5644871, 7.0736039 43.5631961, 7.0752454 43.5624735, 7.0770371 43.5621627, 7.0800126 43.5630951, 7.0819438 43.5644859, 7.0842791 43.5657110, 7.0856094 43.5667521, 7.0845294 43.5681066, 7.0839608 43.5685883, 7.0836711 43.5687980, 7.0820117 43.5679922, 7.0817328 43.5681398, 7.0806956 43.5676822, 7.0796585 43.5671795, 7.0783746 43.5664927, 7.0777094 43.5666791, 7.0765722 43.5664460, 7.0759892 43.5663658, 7.0753992 43.5662466, 7.0749736 43.5662233, 7.0746052 43.5660550, 7.0735967 43.5656121, 7.0727491 43.5652529, 7.0729852 43.5650119, 7.0731622 43.5647592, 7.0725185 43.5644871))')
from cities
where name = 'Vallauris-Golfe-Juan';

