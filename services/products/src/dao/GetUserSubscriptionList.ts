import { QueryTypes } from "sequelize";

import { getSequelize, GetUserSubscriptionListOutputData, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

export const GetUserSubscriptionList = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames((c) => {
            switch (c) {
                case "user_name":
                    return "u.firstname || ' ' || u.lastname";
                case "user_phone":
                    return "u.phone";
                case "product_duration":
                    return "p.duration";
                case "product_price":
                    return "p.price";
                case "product_name":
                    return "p.name";
                case "city_name":
                    return "c.name";
                default:
                    return `us.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "user_name":
                case "product_name":
                case "city_name":
                    return `UPPER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "user_name":
                case "product_name":
                case "city_name":
                    return `UPPER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);

    const response = await getSequelize().query<GetUserSubscriptionListOutputData>(`
        SELECT us.*,
            u.firstname || ' ' || u.lastname as user_name,
            u.phone                          as user_phone,
            p.duration                       as product_duration,
            COALESCE(pv.price, p.price)      as product_price,
            p.name                           as product_name,
            c.name                           as city_name
        FROM user_subscriptions us
                LEFT JOIN users u ON us.user_id = u.id
                LEFT JOIN products p ON us.product_id = p.id
                LEFT JOIN product_variations pv ON us.product_variation_id = pv.id
                left join cities c on us.city_id = c.id
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::INTEGER AS count
        FROM user_subscriptions us
                LEFT JOIN users u ON us.user_id = u.id
                LEFT JOIN products p ON us.product_id = p.id
                left join cities c on us.city_id = c.id
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
