import { QueryTypes } from "sequelize";

import {GetReportHistoryOutputData, getSequelize } from "@bikairproject/lib-manager";

export const GetReportHistory = async (bikeId: number) => {
    const histories = await getSequelize().query<GetReportHistoryOutputData>(`
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
        WHERE a.bike_id = :id AND a.created_at > CURRENT_DATE - interval '7day'
        ORDER BY a.id DESC
        LIMIT 7
    `, {
        replacements: {
            id: bikeId
        },
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });

    if (histories.length === 0) {
        const history = await getSequelize().query<GetReportHistoryOutputData>(`
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
        LIMIT 1
    `, {
            replacements: {
                id: bikeId
            },
            raw: false,
            plain: true,
            type: QueryTypes.SELECT
        });
        if (history) {
            histories.push(history);
        }
    }

    return histories;
};
