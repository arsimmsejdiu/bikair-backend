import {QueryTypes} from "sequelize";

import {GetAdminsOutputData,getSequelize, SelectBuilder, SelectBuilderConf} from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export default async function GetAdmins(query: SelectBuilderConf | null) {
    const {queryString, conditions, values} = new SelectBuilder(query)
        .setColumnNames(c => {
            switch (c) {
                case "role":
                    return "r.name";
                case "city_names_string":
                    return "array_to_string((SELECT ARRAY_AGG(c.name) FROM admin_cities ac left join cities c on ac.city_id = c.id WHERE ac.admin_id = a.id), ', ', 'null')";
                default:
                    return `a.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "firstname":
                case "lastname":
                case "email":
                case "locale":
                case "username":
                case "role":
                case "city_names_string":
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
                case "locale":
                case "username":
                case "role":
                case "city_names_string":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<GetAdminsOutputData>(`
        SELECT a.*,
               r.name                                              as role,
               array_to_string((SELECT ARRAY_AGG(c.name)
                                FROM admin_cities ac
                                         left join cities c on ac.city_id = c.id
                                WHERE ac.admin_id = a.id), ', ',
                               'null')                                               as city_names_string,
               (SELECT ARRAY_AGG(c.name)
                FROM admin_cities ac
                         left join cities c on ac.city_id = c.id
                WHERE ac.admin_id = a.id)                                            as city_names
        FROM admins a
            left join roles r on a.role_id = r.id
            ${queryString}

    `, {
        replacements: values,
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM admins a
                 left join roles r on a.role_id = r.id
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
}
