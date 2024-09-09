import { QueryTypes } from "sequelize";

import {getSequelize,Point } from "@bikairproject/lib-manager";


export const GetTripsEndCoords = async () => {
    const response = await getSequelize().query<{ coordinates: Point }>(`
        select t.end_coords as coordinates
        from trips t
        where t.end_coords is not null
        order by t.id desc
        limit 100000
    `, {
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });

    return response ?? [];
};
