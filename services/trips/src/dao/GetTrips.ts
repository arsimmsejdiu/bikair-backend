import { QueryTypes } from "sequelize";

import {getSequelize, GetTripsOutputData,  SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

export const GetTrips = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames(c => {
            switch (c) {
                case "time_start":
                case "time_end":
                    return `TO_CHAR(TO_TIMESTAMP(t.${c}/1000),'DD/MM/YYYY')`;
                case "hour_start":
                    return "TO_CHAR(TO_TIMESTAMP(t.time_start/1000),'HH24:MI')";
                case "hour_end":
                    return "TO_CHAR(TO_TIMESTAMP(t.time_end/1000),'HH24:MI')";
                case "bike_name":
                    return "b.name";
                case "city_name":
                    return "c.name";
                case "user_fullname":
                    return "u.firstname || ' ' || u.lastname";
                default:
                    return `t.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "status":
                case "reference":
                case "bike_name":
                case "user_fullname":
                case "city_name":
                    return `LOWER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "status":
                case "reference":
                case "bike_name":
                case "user_fullname":
                case "city_name":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);
    console.log("[QUERY-VALUES]", values);
    const response = await getSequelize().query<GetTripsOutputData>(`
        SELECT t.*,
               ST_Y(t.end_coords) || ',' || st_x(t.end_coords)     AS end_coords,
               ST_Y(t.start_coords) || ',' || st_x(t.start_coords) AS start_coords,
               b.name                                              as bike_name,
               u.firstname || ' ' || u.lastname                    as user_fullname,
               c.name                                              as city_name,
               d.code                                              as discount_code
        FROM trips t
                 LEFT OUTER JOIN bikes b on t.bike_id = b.id
                 LEFT OUTER JOIN users u on t.user_id = u.id
                 LEFT OUTER JOIN cities c on t.city_id = c.id
                 LEFT OUTER JOIN discounts d on t.discount_id = d.id
            ${queryString}
    `, {
        replacements: values,
        raw: false,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM trips t
                 LEFT OUTER JOIN bikes b on t.bike_id = b.id
                 LEFT OUTER JOIN users u on t.user_id = u.id
                 LEFT OUTER JOIN cities c on t.city_id = c.id
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
