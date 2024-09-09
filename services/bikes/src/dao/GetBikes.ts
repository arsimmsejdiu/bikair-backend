import { QueryTypes } from "sequelize";

import { GetBikesOutputData,getSequelize, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

export const GetBikes = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames(c => {
            switch (c) {
                case "city_name":
                    return "c.name";
                case "lock_version":
                    return "l.version";
                case "imei":
                    return "t.imei";
                case "tags":
                    return "array_to_string(b.tags, ', ', 'null')";
                default:
                    return `b.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "status":
                case "address":
                case "city_name":
                case "lock_version":
                case "imei":
                case "tags":
                    return `UPPER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "status":
                case "address":
                case "city_name":
                case "lock_version":
                case "imei":
                case "tags":
                    return `UPPER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<GetBikesOutputData>(`
        SELECT b.*,
               ST_AsGeoJSON(t.coordinates)::json -> 'coordinates'      as coordinates,
               ST_Y(t.coordinates) || ',' || st_x(t.coordinates)       AS recent_coordinates,
               ST_Y(t.tracker_coords) || ',' || st_x(t.tracker_coords) AS tracker_coordinates,
               c.name                                                  as city_name,
               l.version                                               as lock_version,
               t.imei                                                  as imei
        FROM bikes b
                 LEFT OUTER JOIN trackers t ON b.tracker_id = t.id
                 LEFT OUTER JOIN locks l ON b.lock_id = l.id
                 LEFT OUTER JOIN cities c ON b.city_id = c.id
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM bikes b
                 LEFT OUTER JOIN trackers t ON b.tracker_id = t.id
                 LEFT OUTER JOIN locks l ON b.lock_id = l.id
                 LEFT OUTER JOIN cities c ON b.city_id = c.id
            ${conditions}
    `, {
        replacements: values,
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
