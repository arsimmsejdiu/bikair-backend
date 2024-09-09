import { QueryTypes } from "sequelize";

import { getSequelize, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";
import { GetUsersOutputData } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const GetUsers = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames(c => {
            switch (c) {
                case "city_name":
                    return "c.name";
                case "deposit_status":
                    return "td.status";
                default:
                    return `u.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "firstname":
                case "lastname":
                case "email":
                case "code":
                case "city_name":
                case "resident":
                case "deposit_status":
                    return `LOWER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "firstname":
                case "lastname":
                case "email":
                case "code":
                case "city_name":
                case "resident":
                case "deposit_status":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<GetUsersOutputData>(`
        SELECT u.*,
               c.name                                                            as city_name,
               (select td.status from trip_deposits td order by id desc limit 1) as deposit_status,
               (select ARRAY_AGG(d.code)
                FROM user_discounts ud
                    left join discounts d on ud.discount_id = d.id
                WHERE ud.user_id = u.id)                                         as used_codes
        FROM users u
                 LEFT OUTER JOIN cities c ON u.city_id = c.id
                 LEFT OUTER JOIN trip_deposits td ON u.id = td.user_id
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM users u
                 LEFT OUTER JOIN cities c ON u.city_id = c.id
                 LEFT OUTER JOIN trip_deposits td ON u.id = td.user_id
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
