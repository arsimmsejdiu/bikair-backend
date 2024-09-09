import { QueryTypes } from "sequelize";

import {GetRatesOutputData, getSequelize } from "@bikairproject/lib-manager";

export const GetRates = async () => {
    const response = await getSequelize().query<GetRatesOutputData>(`
        SELECT (COUNT(*) filter (where rate = 1))::integer as rate_1,
               (COUNT(*) filter (where rate = 2))::integer as rate_2,
               (COUNT(*) filter (where rate = 3))::integer as rate_3,
               (COUNT(*) filter (where rate = 4))::integer as rate_4,
               (COUNT(*) filter (where rate = 5))::integer as rate_5
        FROM trip_reviews
    `, {
        raw: false,
        plain: true,
        type: QueryTypes.SELECT
    });

    return {
        rows: response
    };
};
