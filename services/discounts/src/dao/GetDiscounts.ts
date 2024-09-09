import { QueryTypes } from "sequelize";

import {Discounts, getSequelize, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

export const GetDiscounts = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames((c) => {
            switch (c) {
                default:
                    return `d.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `UPPER(${c}::text)`;
                case "code":
                case "type":
                case "status":
                    return `UPPER(${c})`;
                default:
                    return c;
            }
        })
        .setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "code":
                case "type":
                case "status":
                    return `UPPER(${v})`;
                default:
                    return v;
            }
        })
        .build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<Discounts>(
        `
            SELECT d.*
            FROM discounts d
                ${queryString}
        `,
        {
            replacements: values,
            type: QueryTypes.SELECT
        }
    );
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM discounts d ${conditions}
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
