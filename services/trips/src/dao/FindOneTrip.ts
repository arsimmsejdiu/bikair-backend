import Transaction, { QueryTypes } from "sequelize";

import {getSequelize,TripOutputWithLock } from "@bikairproject/lib-manager";

export const FindOneTrip = async (tripId: number, transaction?: Transaction.Transaction) => {
    return await
    getSequelize().query<TripOutputWithLock>(`
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
                b.name                                              as bike_name,
                b.id                                                as bike_id,
                b.tracker_id
            FROM trips t
                LEFT JOIN trip_status s ON s.trip_id = t.id
                left join bikes b on t.bike_id = b.id
                LEFT JOIN locks l ON b.id = l.bike_id
            WHERE t.id = :tripId
                AND l.status = 'ACTIVE'
            GROUP BY t.id, l.id, l.uuid, l.keysafe_id, l.state, l.keysafe_key, l.uid, t.start_coords, b.name,
                b.id, b.tracker_id
        `, {
        replacements: {
            tripId: tripId
        },
        raw: true,
        plain: true,
        type: QueryTypes.SELECT,
        transaction: transaction
    });
};
