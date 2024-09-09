import {QueryTypes} from "sequelize";

import {BikeTechnician, DataCacheResult,getSequelize} from "@bikairproject/lib-manager";

/**
 *
 * @param citiesId
 * @param statusValue {string[]}
 * @param lastUpdate {number|null}
 * @param tag {string|null}
 * @return {Promise<{total, lastUpdate: number | null, rows: *}>}
 */
export const GetBikesTechnician = async (citiesId: number[] | null, statusValue: string[], lastUpdate: number | null = null): Promise<DataCacheResult<BikeTechnician>> => {
    let clauseCount = 0;

    let statusClause = "";
    const statusReplacement: { statusValue?: string[] } = {};
    if (statusValue !== null && statusValue.length > 0) {
        statusClause = "bk.status in (:statusValue)";
        if(clauseCount === 0) {
            statusClause = "where " + statusClause;
        } else {
            statusClause = "and " + statusClause;
        }
        clauseCount += 1;
        statusReplacement.statusValue = statusValue;
    }

    let lastUpdateClause = "";
    const lastUpdateReplacement: { lastUpdate?: number | null } = {};
    if (lastUpdate) {
        lastUpdateClause = "((EXTRACT(EPOCH FROM bk.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM t.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM bt.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM l.updated_at) > :lastUpdate))";
        if(clauseCount === 0) {
            lastUpdateClause = "where " + lastUpdateClause;
        } else {
            lastUpdateClause = "and " + lastUpdateClause;
        }
        clauseCount += 1;
        lastUpdateReplacement.lastUpdate = lastUpdate;
    }

    let citiesClause = "";
    const citiesReplacement: { citiesId?: number[] } = {};
    if (citiesId !== null && citiesId.length > 0) {
        citiesClause = "bk.city_id in (:citiesId)";
        if(clauseCount === 0) {
            citiesClause = "where " + citiesClause;
        } else {
            citiesClause = "and " + citiesClause;
        }
        clauseCount += 1;
        citiesReplacement.citiesId = citiesId;
    }

    const response = await getSequelize().query<BikeTechnician>(`
        SELECT bk.*,
               ST_AsGeoJSON(t.coordinates)::json -> 'coordinates' as coordinates,
               t.coordinates                                      as marker_coordinates,
               bt.soc                                             as capacity,
               52                                                 as full_capacity,
               l.state                                            AS lock_state,
               l.uuid                                             AS lock_uuid,
               'BIKE'                                             as marker_type,
               FALSE                                              as reported
        FROM bikes bk
                 LEFT JOIN trackers t
                           ON t.bike_id = bk.id AND t.status = 'ACTIVE'
                 LEFT JOIN batteries bt
                           ON bt.bike_id = bk.id AND bt.status = 'ACTIVE'
                 LEFT JOIN locks l
                           ON bk.id = l.bike_id AND l.status = 'ACTIVE'
                               ${statusClause}
                               ${citiesClause}
                               ${lastUpdateClause}
    `, {
        replacements: {
            ...statusReplacement,
            ...citiesReplacement,
            ...lastUpdateReplacement
        },
        raw: false,
        type: QueryTypes.SELECT
    });

    return {
        total: response.length,
        lastUpdate: Math.floor(new Date().getTime() / 1000),
        rows: response
    };
};
