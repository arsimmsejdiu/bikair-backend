import Transaction, { QueryTypes } from "sequelize";

import { getSequelize } from "@bikairproject/lib-manager";

export const GetOpenTrip = async (userId: number, transaction?: Transaction.Transaction) => {
    return await getSequelize().query<any>(`
        SELECT t.*,
            JSON_BUILD_OBJECT(
                'lock_id', l.id,
                'lock_uuid', l.uuid,
                'lock_uid', l.uid,
                'keysafe_id', l.keysafe_id,
                'keysafe_key', l.keysafe_key,
                'state', l.state
                )                                               AS lock,
            ARRAY_AGG(s.status)                                 AS list_status,
            b.name                                              AS bike_name,
            b.tags                                              AS bike_tags,
            b.id                                                AS bike_id,
            b.tracker_id
    FROM trips t
                LEFT JOIN trip_status s ON s.trip_id = t.id
                left join bikes b on t.bike_id = b.id
                LEFT JOIN locks l ON b.id = l.bike_id
        WHERE t.user_id = :userId
            AND t.status = 'OPEN'
            AND l.status = 'ACTIVE'
        GROUP BY t.id, l.id, l.uuid, l.keysafe_id, l.state, l.keysafe_key, l.uid, t.start_coords, b.name,
                b.id
    `, {
        replacements: {
            userId: userId,
        },
        raw: true,
        plain: true,
        type: QueryTypes.SELECT,
        transaction: transaction
    });
};
