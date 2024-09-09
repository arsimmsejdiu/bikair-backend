import {QueryTypes} from "sequelize";
import {GetCityRedZonesOutputData, getSequelize, SelectBuilder, SelectBuilderConf} from "@bikairproject/lib-manager";

/**
 * Get the red zones based on the provided query.
 *
 * @param query The query configuration for selecting red zones.
 * @returns An object containing the total count, limit, offset, and rows of red zones.
 */
export const GetRedZones = async (query: SelectBuilderConf | null) => {
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

    // Build the query string, conditions, and values using the SelectBuilder
    const {queryString, conditions, values} = builder.setColumnNames(c => {
        switch (c) {
            case "city_name":
                return "c.name";
            default:
                return `crz.${c}`;
        }
    }).setColumnDecorator((original, c) => {
        switch (original) {
            case "name":
            case "status":
            case "city_name":
                return `LOWER(${c})`;
            default:
                return `${c}`;
        }
    }).setValueDecorator((c, v) => {
        switch (c) {
            case "name":
            case "status":
            case "city_name":
                return `LOWER(${v})`;
            default:
                return `${v}`;
        }
    }).build();

    // Log the generated query string
    console.log("[QUERY-STRING]", queryString);

    // Execute the main query to fetch the red zones
    const response = await getSequelize().query<GetCityRedZonesOutputData>(`
        SELECT crz.*,
               c.name AS city_name
        from city_red_zones crz
                 LEFT OUTER JOIN cities c ON crz.id = c.id
            ${queryString}

    `, {
        replacements: values,
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });

    // Execute a separate query to get the total count of red zones
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*) as count
        from city_red_zones crz
                 LEFT OUTER JOIN cities c ON crz.id = c.id
         ${conditions}
    `, {
        replacements: values,
        raw: false,
        plain: true,
        type: QueryTypes.SELECT
    });

    // Return the result object containing the total count, limit, offset, and rows of red zones
    return {
        total: total?.count ?? 0,
        limit: response.length,
        offset: query?.offset ?? 0,
        rows: response
    };
};
