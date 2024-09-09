import {QueryTypes} from "sequelize";

import {getSequelize, GetSpotsOutputData, SelectBuilder, SelectBuilderConf} from "@bikairproject/lib-manager";

export const GetSpots = async (query: SelectBuilderConf | null) => {
    const {queryString, conditions, values} = new SelectBuilder(query)
        .setColumnNames(c => {
            switch (c) {
                case "nb_bikes":
                    return "(SELECT count(*) from trackers t WHERE t.status = 'ACTIVE' and ST_DWithin(st_setsrid(t.coordinates, 4326), st_setsrid(s.polygon, 4326), 0))";
                case "city_name":
                    return "c.name";
                default:
                    return `s.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "name":
                case "city_name":
                    return `LOWER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "name":
                case "city_name":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<GetSpotsOutputData>(`
        SELECT s.*,
               ST_AsGeoJSON(s.polygon)::json -> 'coordinates'                               as polygon,
               s.polygon                                                                    as spot_polygon,
               st_y(s.coordinates) || ',' || st_x(s.coordinates)                            AS spot_coordinates,
               c.name                                                                       as city_name,
               (SELECT count(*)
                from trackers t
                WHERE t.status = 'ACTIVE'
                  and ST_DWithin(t.coordinates::geography, st_setsrid(s.polygon, 4326), 3)) AS nb_bikes
        FROM city_spots s
                 LEFT OUTER JOIN cities c ON s.city_id = c.id
            ${queryString}
    `, {
        replacements: values,
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM city_spots s
                 LEFT OUTER JOIN cities c ON s.city_id = c.id
            ${conditions}
    `, {
        replacements: values,
        raw: false,
        plain: true,
        type: QueryTypes.SELECT
    });

    return {
        total: total?.count ?? 0,
        limit: response.length,
        offset: query?.offset ?? 0,
        rows: response
    };
};
