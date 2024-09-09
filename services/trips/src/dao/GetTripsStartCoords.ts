import { QueryTypes } from "sequelize";

import {getSequelize,Point } from "@bikairproject/lib-manager";
import {} from "@bikairproject/shared";


export const GetTripsStartCoords = async () => {
    const response = await getSequelize().query<{ coordinates: Point }>(`
        select t.start_coords as coordinates
        from trips t
        where t.start_coords is not null
        order by t.id desc
        limit 100000
    `, {
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });

    return response || [];
};
