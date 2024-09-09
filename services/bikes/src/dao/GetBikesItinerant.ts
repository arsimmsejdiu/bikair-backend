import {QueryTypes} from "sequelize";

import {BikeTechnician,getSequelize} from "@bikairproject/lib-manager";

export const GetBikesItinerant = async (citiesId: number[] | null, statusValue: string[] | null, tagsValue: string[] | null, lastUpdate: number | null = null) => {
    let statusClause = "";
    const statusReplacement: { statusValue?: string[] } = {};
    if (statusValue !== null && statusValue.length > 0) {
        statusClause = "and b.status in (:statusValue)";
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
        tagsClause = "and " + tagsClause + ")";
    }

    let lastUpdateClause = "";
    const lastUpdateReplacement: { lastUpdate?: number | null } = {};
    if (lastUpdate) {
        lastUpdateClause = "((EXTRACT(EPOCH FROM b.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM tr.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM bt.updated_at) > :lastUpdate) OR (EXTRACT(EPOCH FROM l.updated_at) > :lastUpdate))";
        lastUpdateReplacement.lastUpdate = lastUpdate;
        lastUpdateClause = "and " + lastUpdateClause;
    }

    let citiesClause = "";
    const citiesReplacement: { citiesId?: number[] } = {};
    if (citiesId !== null && citiesId.length > 0) {
        citiesClause = "b.city_id in (:citiesId)";
        citiesReplacement.citiesId = citiesId;
        citiesClause = "and " + citiesClause;
    }

    const response = await getSequelize().query<BikeTechnician>(`
        with last_report as (select distinct on (r.bike_id) r.bike_id, r.created_at
                             from reports r
                             order by r.bike_id, r.created_at desc)
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
        where ('COLLECT' != any (b.tags))
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
