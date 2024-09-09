import {QueryTypes} from "sequelize";

import { getSequelize, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const GetNotifications = async (query: SelectBuilderConf | null) => {
    const {queryString, conditions, values} = new SelectBuilder(query).build();
    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query(`
        SELECT *
        FROM notifications
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{count: number}>(`
        SELECT COUNT(*)::integer as count
        FROM notifications
            ${conditions}
    `, {
        replacements: values,
        plain: true,
        type: QueryTypes.SELECT
    });
    const _total = total?.count ?? 0;
    return {
        statusCode: 200,
        result: {
            total: _total,
            limit: query?.limit ?? _total,
            offset: query?.offset ?? 0,
            rows: response
        }

    };
};
