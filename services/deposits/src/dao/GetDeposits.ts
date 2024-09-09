import {QueryTypes} from "sequelize";

import { getSequelize, GetTripDepositOutput, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";


export const GetDeposit = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames(c => {
            switch (c) {
                case "payment_intent":
                    return "td.payment_intent";
                case "firstname":
                    return "u.firstname";
                case "lastname":
                    return "u.lastname";
                default:
                    return `td.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "status":
                case "payment_intent":
                case "user_fullname":
                    return `LOWER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "status":
                case "payment_intent":
                case "user_fullname":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        }).build();
    const response = await getSequelize().query<GetTripDepositOutput>(`
        SELECT  td.*,
                u.firstname,
                u.lastname
        FROM trip_deposits td
            LEFT OUTER JOIN users u ON td.user_id = u.id
            ${queryString}
    `, {
        replacements: values,
        raw: false,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM trip_deposits td
                LEFT OUTER JOIN users u on td.user_id = u.id
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
