import {QueryTypes} from "sequelize";

import {BikeClient, getSequelize} from "@bikairproject/lib-manager";

export const GetBikeBooked = async (
    userId: number,
    lastUpdate: number | null = null
): Promise<BikeClient | null> => {
    const values: any[] = [userId];

    let queryString = "WHERE bk.status = 'BOOKED' and bc.user_id = ?";

    if (lastUpdate !== null) {
        const testDateUpdateTracker = "(EXTRACT(EPOCH FROM t.updated_at) > ?)";
        values.push(lastUpdate);
        const testDateUpdateBikes = "(EXTRACT(EPOCH FROM bk.updated_at) > ?)";
        values.push(lastUpdate);
        const testDateUpdateBatterie = "(EXTRACT(EPOCH FROM bt.updated_at) > ?)";
        values.push(lastUpdate);
        const testDateUpdateLocks = "(EXTRACT(EPOCH FROM l.updated_at) > ?)";
        values.push(lastUpdate);
        queryString += ` AND (${testDateUpdateTracker} OR ${testDateUpdateBikes} OR ${testDateUpdateBatterie} OR ${testDateUpdateLocks})`;
    }

    console.log("[QUERY-STRING]", queryString);

    return await getSequelize().query<BikeClient>(`
        SELECT bk.*,
               t.coordinates as coordinates,
               t.coordinates as marker_coordinates,
               bt.soc        as capacity,
               l.state       AS lock_state,
               l.uuid        AS lock_uuid,
               'BIKE'        as marker_type
        FROM bikes bk
                 LEFT JOIN trackers t
                           ON t.bike_id = bk.id AND t.status = 'ACTIVE'
                 LEFT JOIN batteries bt
                           ON bt.bike_id = bk.id AND bt.status = 'ACTIVE'
                 LEFT JOIN locks l
                           ON bk.id = l.bike_id AND l.status = 'ACTIVE'
                 LEFT JOIN bookings bc
                           ON bk.id = bc.bike_id AND bc.status = 'OPEN'
                               ${queryString}
    `, {
        replacements: values,
        plain: true,
        raw: false,
        type: QueryTypes.SELECT
    });
};
