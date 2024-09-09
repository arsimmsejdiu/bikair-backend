import {QueryTypes} from "sequelize";

import {AccessRights, getSequelize, SelectBuilder, SelectBuilderConf} from "@bikairproject/lib-manager";

export const GetAccessRights = async (query: SelectBuilderConf | null) => {
    const {queryString, conditions, values} = new SelectBuilder(query)
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "name":
                case "category":
                    return `UPPER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "name":
                case "category":
                    return `UPPER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);

    const response = await getSequelize().query<AccessRights>(`
        SELECT *
        FROM access_rights ar
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });

    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM access_rights ${conditions}
    `, {
        replacements: values,
        plain: true,
        type: QueryTypes.SELECT
    });

    return {
        total: total?.count ?? 0,
        limit: response.length,
        offset: query?.offset ?? 0,
        rows: response,
    };

};
