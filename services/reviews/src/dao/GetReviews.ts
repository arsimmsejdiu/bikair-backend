import { QueryTypes } from "sequelize";

import {GetReviewsOutputData, getSequelize, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

export const GetReviews = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames((c) => {
            switch (c) {
                case "firstname":
                    return "u.firstname";
                case "lastname":
                    return "u.lastname";
                case "phone":
                    return "u.phone";
                case "email":
                    return "u.email";
                case "user_id":
                    return "t.user_id";
                case "bike_name":
                    return "b.name";
                case "user_name":
                    return "u.firstname || ' ' || u.lastname";
                case "city_name":
                    return "c.name";
                default:
                    return `r.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "comment":
                case "bike_name":
                case "user_name":
                case "city_name":
                    return `LOWER(${c})`;
                default:
                    return c;
            }
        })
        .setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "comment":
                case "bike_name":
                case "user_name":
                case "city_name":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        })
        .build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<GetReviewsOutputData>(
        `
            SELECT r.*,
                   b.name                                                          AS bike_name,
                   u.id                                                            AS user_id,
                   u.firstname || ' ' || u.lastname                                AS user_name,
                   c.name                                                          AS city_name
            FROM trip_reviews r
                     LEFT JOIN trips t
                               ON t.id = r.trip_id
                     LEFT JOIN users u
                               ON u.id = t.user_id
                     LEFT JOIN cities c
                               ON c.id = t.city_id
                     LEFT JOIN bikes b
                               ON b.id = t.bike_id
                                   ${queryString}
        `,
        {
            replacements: values,
            raw: false,
            plain: false,
            type: QueryTypes.SELECT
        }
    );
    console.log("[conditions]", conditions);
    const total = await getSequelize().query<{count: number}>(
        `
            SELECT count(*)::integer as count
            FROM trip_reviews r
                     LEFT JOIN trips t
                               ON t.id = r.trip_id
                     LEFT JOIN users u
                               ON u.id = t.user_id
                     LEFT JOIN cities c
                               ON c.id = t.city_id
                     LEFT JOIN bikes b
                               ON b.id = t.bike_id
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
