import { QueryTypes } from "sequelize";

import {GetReportDetailOutput, getSequelize } from "@bikairproject/lib-manager";

export const GetReportDetail = async (bikeId: number) => {
    return await getSequelize().query<GetReportDetailOutput>(`
        SELECT a.*,
               ST_Y(a.coordinates) as lat,
               ST_X(a.coordinates) as lng,
               b.name              AS spot_name,
               c.lastname,
               c.firstname,
               c.phone,
               c.email
        FROM reports a
                 LEFT JOIN city_spots b
                           ON b.id = a.spot_id
                 LEFT JOIN admins c
                           ON c.id = a.admin_id
        WHERE a.bike_id = :id
        ORDER BY a.id DESC
    `, {
        replacements: {
            id: bikeId
        },
        raw: false,
        plain: true,
        type: QueryTypes.SELECT
    });
};
