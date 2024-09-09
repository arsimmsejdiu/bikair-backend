import { QueryTypes } from "sequelize";

import {GetReportsOutputData, getSequelize, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

export const GetReports = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames((c) => {
            switch (c) {
                case "incidents_string":
                    return "array_to_string(r.incidents, ', ', 'null')";
                case "bike_name":
                    return "b.name";
                case "admin_fullname":
                    return "a.firstname || ' ' || a.lastname";
                case "spot_name":
                    return "s.name";
                default:
                    return `r.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "comment":
                case "workshop":
                case "bike_name":
                case "admin_fullname":
                case "spot_name":
                case "incidents_string":
                    return `LOWER(${c})`;
                default:
                    return c;
            }
        })
        .setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "comment":
                case "workshop":
                case "bike_name":
                case "user_fullname":
                case "spot_name":
                case "incidents_string":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        })
        .build();
    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<GetReportsOutputData>(
        `
            SELECT r.*,
                   ST_Y(r.coordinates) || ',' || st_x(r.coordinates) AS report_coordinates,
                   b.name                                            as bike_name,
                   a.firstname || ' ' || a.lastname                  as admin_fullname,
                   s.name                                            as spot_name,
                   array_to_string(r.incidents, ', ', 'null')        as incidents_string
            FROM reports r
                     LEFT OUTER JOIN bikes b ON r.bike_id = b.id
                     LEFT OUTER JOIN admins a on r.admin_id = a.id
                     LEFT OUTER JOIN city_spots s on r.spot_id = s.id
                ${queryString}
        `,
        {
            replacements: values,
            type: QueryTypes.SELECT
        }
    );
    const total = await getSequelize().query<{ count: number }>(
        `
            SELECT COUNT(*)::integer as count
            FROM reports r
                     LEFT OUTER JOIN bikes b ON r.bike_id = b.id
                     LEFT OUTER JOIN admins a on r.admin_id = a.id
                     LEFT OUTER JOIN city_spots s on r.spot_id = s.id
                ${conditions}
        `,
        {
            replacements: values,
            raw: false,
            plain: true,
            type: QueryTypes.SELECT
        }
    );

    return {
        total: total?.count ?? 0,
        limit: response.length,
        offset: query?.offset ?? 0,
        rows: response
    };
};
