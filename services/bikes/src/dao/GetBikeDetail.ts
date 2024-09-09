import {QueryTypes} from "sequelize";

import {GetBikeDetailOutput,getSequelize} from "@bikairproject/lib-manager";

export const GetBikeDetail = async (bikeId: number) => {
    return await getSequelize().query<GetBikeDetailOutput>(`
            SELECT a.*,
                b.name              AS city_name,
                c.state,
                c.updated_at        AS lock_updated_at,
                c.uid               AS lock_uid,
                c.keysafe_id,
                d.event,
                d.origin,
                d.imei,
                d.tracker_coords,
                ST_Y(d.coordinates) as lat,
                ST_X(d.coordinates) as lng,
                e.full_capacity,
                e.capacity,
                e.soc,
                e.status            AS battery_status,
                t.end_photo
            FROM bikes a
                LEFT JOIN cities b
                            ON b.id = a.city_id
                LEFT JOIN locks c
                            ON c.id = a.lock_id
                LEFT JOIN trackers d
                            ON d.id = a.tracker_id
                LEFT JOIN batteries e
                            ON e.id = a.battery_id
                LEFT JOIN LATERAL (
                    SELECT
                        id,
                        bike_id,
                        end_photo,
                        created_at
                    FROM
                        trips
                    WHERE
                        bike_id = a.id
                    ORDER BY
                        created_at DESC
                    LIMIT 1
                    ) t ON true
            WHERE a.id = :bikeId
    `, {
        replacements: {
            bikeId: bikeId
        },
        raw: true,
        plain: true,
        type: QueryTypes.SELECT
    });
};
