import { QueryTypes } from "sequelize";

import { BikeTechnician,getSequelize } from "@bikairproject/lib-manager";


export const GetBikesController = async (citiesId: number[] | null, statusValue: string[] | null, tagsValue: string[] | null, lastUpdate: number | null = null) => {
    let clauseCount = 0;

    let statusClause = "";
    const statusReplacement: { statusValue?: string[] } = {};
    if (statusValue !== null && statusValue.length > 0) {
        statusClause = "b.status in (:statusValue)";
        if(clauseCount === 0) {
            statusClause = "where " + statusClause;
        } else {
            statusClause = "and " + statusClause;
        }
        clauseCount += 1;
        statusReplacement.statusValue = statusValue;
    }

    let tagsClause = "";
    if (tagsValue !== null && tagsValue.length > 0) {
        tagsClause = "(";
        for (let i = 0; i < tagsValue.length; i++) {
            if (i > 0) {
                tagsClause = tagsClause + " or ";
            }
            tagsClause = tagsClause + `'${tagsValue[i]}' = ANY (b.tags)`;
        }
        tagsClause = tagsClause + ")";
        if(clauseCount === 0) {
            tagsClause = "where " + tagsClause;
        } else {
            tagsClause = "and " + tagsClause;
        }
        clauseCount += 1;
    }

    let lastUpdateClause = "";
    const lastUpdateReplacement: { lastUpdate?: number | null } = {};
    if (lastUpdate) {
        lastUpdateClause = "((EXTRACT(EPOCH FROM b.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM tr.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM bt.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM l.updated_at) > :lastUpdate))";
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
        citiesClause = "b.city_id in (:citiesId)";
        if(clauseCount === 0) {
            citiesClause = "where " + citiesClause;
        } else {
            citiesClause = "and " + citiesClause;
        }
        clauseCount += 1;
        citiesReplacement.citiesId = citiesId;
    }

    const response = await getSequelize().query<BikeTechnician>(`
        with last_reports as (select distinct on (bike_id) bike_id, created_at
                              from reports
                              order by bike_id, created_at desc)
        select b.*,
               ST_AsGeoJSON(tr.coordinates)::json -> 'coordinates'       as coordinates,
               tr.coordinates                                            as marker_coordinates,
               bt.soc                                                    as capacity,
               52                                                        as full_capacity,
               l.state                                                   AS lock_state,
               l.uuid                                                    AS lock_uuid,
               'BIKE'                                                    as marker_type,
               r.created_at > (CURRENT_DATE + TIME '02:45')::timestamptz as reported
        from bikes b
                 LEFT JOIN trackers tr
                           ON tr.bike_id = b.id and tr.status = 'ACTIVE'
                 LEFT JOIN batteries bt
                           ON bt.bike_id = b.id and bt.status = 'ACTIVE'
                 LEFT JOIN locks l
                           ON b.id = l.bike_id AND l.status = 'ACTIVE'
                 left join last_reports r on b.id = r.bike_id
            ${statusClause}
                ${tagsClause}
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
