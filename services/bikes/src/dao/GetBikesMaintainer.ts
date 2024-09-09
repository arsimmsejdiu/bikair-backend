import { QueryTypes } from "sequelize";

import { BikeTechnician,getSequelize } from "@bikairproject/lib-manager";

export const GetBikesMaintainer = async (citiesId: number[] | null, statusValue: string[] | null, tagsValue: string[] | null, lastUpdate: number | null = null) => {
    let statusClause = "";
    const statusReplacement: { statusValue?: string[] } = {};
    if (statusValue !== null && statusValue.length > 0) {
        statusClause = "and b.status in (:statusValue)";
        statusReplacement.statusValue = statusValue;
    }

    let tagsClause = "";
    if (tagsValue !== null && tagsValue.length > 0) {
        tagsClause = "and (";
        for (let i = 0; i < tagsValue.length; i++) {
            if (i > 0) {
                tagsClause = tagsClause + " or ";
            }
            tagsClause = tagsClause + `'${tagsValue[i]}' = ANY (b.tags)`;
        }
        tagsClause = tagsClause + ")";
    }

    let lastUpdateClause = "";
    const lastUpdateReplacement: { lastUpdate?: number | null } = {};
    if (lastUpdate) {
        lastUpdateClause = "and ((EXTRACT(EPOCH FROM b.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM tr.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM bt.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM l.updated_at) > :lastUpdate))";
        lastUpdateReplacement.lastUpdate = lastUpdate;
    }

    let citiesClause = "";
    const citiesReplacement: { citiesId?: number[] } = {};
    if (citiesId !== null && citiesId.length > 0) {
        citiesClause = "and b.city_id in (:citiesId)";
        citiesReplacement.citiesId = citiesId;
    }

    const response = await getSequelize().query<BikeTechnician>(`
        with last_report as (select distinct on (r.bike_id) r.bike_id, r.created_at
                             from reports r
                             order by r.bike_id, r.created_at desc),
             last_rc as (select distinct on (t.bike_id) t.bike_id, r.issue
                         from trip_reviews r
                                  left join trips t on r.trip_id = t.id
                         order by t.bike_id, t.created_at desc),
             last_trip as (select distinct on (t.bike_id) t.bike_id, t.created_at
                           from trips t
                           order by t.bike_id, t.created_at desc)
        select b.*,
               ST_AsGeoJSON(tr.coordinates)::json -> 'coordinates'    as coordinates,
               tr.coordinates                                         as marker_coordinates,
               bt.soc                                                 as capacity,
               52                                                     as full_capacity,
               l.state                                                as lock_state,
               l.uuid                                                 as lock_uuid,
               'BIKE'                                                 as marker_type,
               rp.created_at > (current_timestamp - interval '1 day') as reported
        from bikes b
                 LEFT JOIN trackers tr
                           ON tr.bike_id = b.id and tr.status = 'ACTIVE'
                 LEFT JOIN batteries bt
                           ON bt.bike_id = b.id and bt.status = 'ACTIVE'
                 LEFT JOIN locks l
                           ON b.id = l.bike_id AND l.status = 'ACTIVE'
                 left join last_report rp on b.id = rp.bike_id
                 left join last_rc rc on b.id = rc.bike_id
                 left join last_trip lt on b.id = lt.bike_id
        where (lt.created_at BETWEEN CURRENT_DATE - 1 + TIME '03:00' AND CURRENT_DATE + TIME '03:00')
          and 'MECHANICAL' = any (rc.issue)
            ${statusClause} ${tagsClause} ${citiesClause} ${lastUpdateClause}
    `, {
        replacements: {
            ...statusReplacement,
            ...citiesReplacement,
            ...lastUpdateReplacement
        },
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });

    return {
        total: response.length,
        lastUpdate: Math.floor(new Date().getTime() / 1000),
        rows: response
    };
};
