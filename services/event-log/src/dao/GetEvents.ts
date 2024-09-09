import { QueryTypes } from "sequelize";

import { EventLogModel, getSequelize, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";

const GetEvents = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames(c => {
            switch (c) {
                default:
                    return `e.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "uuid":
                    return `LOWER(${c}::text)`;
                case "type":
                case "message":
                    return `LOWER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "uuid":
                case "type":
                case "message":
                    return `LOWER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<EventLogModel>(`
        SELECT e.*
        FROM event_log e
            ${queryString}
    `, {
        replacements: values,
        raw: false,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM trip_reviews ${conditions}
    `, {
        replacements: values,
        plain: true,
        raw: false,
        type: QueryTypes.SELECT
    });

    return {
        total: total?.count ?? 0,
        limit: response.length,
        offset: query?.offset ?? 0,
        rows: response
    };
};

export default GetEvents;
