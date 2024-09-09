import { QueryTypes } from "sequelize";

import { getSequelize, MarketingCampaigns, SelectBuilder, SelectBuilderConf } from "@bikairproject/lib-manager";


export const GetMarketings = async (query: SelectBuilderConf | null) => {
    const { queryString, conditions, values } = new SelectBuilder(query)
        .setColumnNames((c) => {
            switch (c) {
                case "title_fr":
                    return "mc.title ->> 'fr'";
                case "title_en":
                    return "mc.title ->> 'en'";
                case "message_fr":
                    return "mc.message ->> 'fr'";
                case "message_en":
                    return "mc.message ->> 'en'";
                default:
                    return `mc.${c}`;
            }
        })
        .setColumnDecorator((original, c) => {
            switch (original) {
                case "name":
                case "frequency":
                case "title_fr":
                case "title_en":
                case "message_fr":
                case "message_en":
                    return `UPPER(${c})`;
                default:
                    return c;
            }
        }).setValueDecorator((c, v) => {
            switch (c) {
                case "name":
                case "frequency":
                case "title_fr":
                case "title_en":
                case "message_fr":
                case "message_en":
                    return `UPPER(${v})`;
                default:
                    return v;
            }
        }).build();

    console.log("[QUERY-STRING]", queryString);
    const response = await getSequelize().query<MarketingCampaigns>(`
        SELECT mc.*,
               mc.title ->> 'fr'   as title_fr,
               mc.title ->> 'en'   as title_en,
               mc.message ->> 'fr' as message_fr,
               mc.message ->> 'en' as message_en
        FROM marketing_campaigns mc
            ${queryString}
    `, {
        replacements: values,
        type: QueryTypes.SELECT
    });
    const total = await getSequelize().query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM marketing_campaigns mc ${conditions}
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
