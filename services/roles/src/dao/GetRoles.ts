import {QueryTypes} from "sequelize";

import {getSequelize, Roles, SelectBuilder, SelectBuilderConf} from "@bikairproject/lib-manager";

export const GetRoles = async (query: SelectBuilderConf | null) => {
    const {queryString, conditions, values} = new SelectBuilder(query)
        .setColumnNames((c) => {
            switch (c) {
                case "access_rights":
                    return "array_to_string((SELECT ARRAY_AGG(ar.name) FROM roles_access_rights rar left join access_rights ar on rar.access_right_id = ar.id WHERE rar.role_id = r.id), ', ', 'null')";
                default:
                    return `r.${c}`;
            }
        }).setColumnDecorator((original, c) => {
            switch (original) {
                case "name":
                case "active":
                case "description":
                case "created_at":
                case "updated_at":
                    return `UPPER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "name":
                case "active":
                case "description":
                case "created_at":
                case "updated_at":
                    return `UPPER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);

    const response = await getSequelize().query<Roles>(`
        SELECT r.*,
               array_to_string((SELECT ARRAY_AGG(ar.name) 
                                FROM roles_access_rights rar
                                         left join access_rights ar on rar.access_right_id = ar.id
                                WHERE rar.role_id = r.id), ', ',
                               'null') as access_rights
        FROM roles r
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM roles r ${conditions}
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
