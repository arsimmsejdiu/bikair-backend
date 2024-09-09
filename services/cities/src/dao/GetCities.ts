import {QueryTypes} from "sequelize";

import {GetCitiesOutputData, getSequelize, SelectBuilder, SelectBuilderConf} from "@bikairproject/lib-manager";

export const GetCities = async (query: SelectBuilderConf | null) => {
    let builder: SelectBuilder;
    if (query === null) {
        const queryColumns = ["status"];
        const queryOperators = ["="];
        const queryValues = ["ACTIVE"];

        builder = new SelectBuilder({
            query: {
                columns: queryColumns,
                operators: queryOperators,
                values: queryValues
            }
        });
    } else {
        builder = new SelectBuilder(query);
    }

    const {queryString, conditions, values} = builder.setColumnNames((c) => {
        switch (c) {
            default:
                return `c.${c}`;
        }
    }).setColumnDecorator((original, c) => {
        switch (original) {
            case "uuid":
                return `LOWER(${c}::text)`;
            case "name":
                return `LOWER(${c})`;
            default:
                return c;
        }
    }).setValueDecorator((c, v) => {
        switch (c) {
            case "uuid":
            case "name":
                return `LOWER(${v})`;
            default:
                return v;
        }
    }).build();

    console.log("[QUERY-STRING]", queryString);
    let response = await getSequelize().query<GetCitiesOutputData>(`
        SELECT c.*,
               ST_AsGeoJSON(c.polygon)::json -> 'coordinates' as polygon
        FROM cities c
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(c.*) as count
        FROM cities c
            ${conditions}
    `, {
        replacements: values,
        plain: true,
        type: QueryTypes.SELECT
    });

    response = response.sort((a, b) => a.name.localeCompare(b.name, "fr-FR"));

    return {
        total: total?.count ?? 0,
        limit: response.length,
        offset: query?.offset ?? 0,
        rows: response
    };
};
