import { QueryTypes } from "sequelize";

import {
    BIKE_STATUS,
    BikeClient,
    DataCacheResult,
    getSequelize,
    SelectBuilder,
    SelectBuilderQuery
} from "@bikairproject/lib-manager";

/**
 *
 * @param statusValue {string[]}
 * @param lng {number|null}
 * @param lat {number|null}
 * @param perimeter {string}
 * @param limit {number|null}
 * @param offset {number}
 * @param lastUpdate {number|null}
 * @param tag {string|null}
 * @return {Promise<{total, lastUpdate: number | null, rows: *}>}
 */
export const GetBikesNearBy = async (statusValue: string[],
    lng: number | null = null,
    lat: number | null = null,
    perimeter = 1000,
    limit: number | null = null,
    offset = 0,
    lastUpdate: number | null = null,
    tag: string | null = null): Promise<DataCacheResult<BikeClient>> => {
    let query;

    const queryColumns: string[] = [];
    const queryOperators: string[] = [];
    const queryValues: (string | string[])[] = [];

    if(statusValue.length !== 0) {
        queryColumns.push("bk.status");
        queryOperators.push("in");
        queryValues.push(statusValue);
    } else if (lastUpdate === null) {
        queryColumns.push("bk.status");
        queryOperators.push("in");
        queryValues.push([BIKE_STATUS.AVAILABLE]);
    }

    if (tag) {
        queryColumns.push(tag);
        queryOperators.push("=");
        queryValues.push("ANY(bk.tags)");
    }

    let queryParam: SelectBuilderQuery | undefined;
    if(queryColumns.length !== 0) {
        queryParam = {
            columns: queryColumns,
            operators: queryOperators,
            values: queryValues
        };
    }

    const build = new SelectBuilder({
        query: queryParam,
        limit: limit,
        offset: offset
    }).setValueDecorator((col, val) => {
        if (col === "bk.status") {
            return `(${val})`;
        } else {
            return val;
        }
    }).build();
    let { queryString, conditions, values } = build;
    const { resultConfig } = build;

    if (lastUpdate !== null) {
        const testDateUpdateTracker = "(EXTRACT(EPOCH FROM t.updated_at) > ?)";
        values.push(lastUpdate);
        const testDateUpdateBikes = "(EXTRACT(EPOCH FROM bk.updated_at) > ?)";
        values.push(lastUpdate);
        const testDateUpdateBatterie = "(EXTRACT(EPOCH FROM bt.updated_at) > ?)";
        values.push(lastUpdate);
        const testDateUpdateLocks = "(EXTRACT(EPOCH FROM l.updated_at) > ?)";
        values.push(lastUpdate);

        const lastUpdateString = `(${testDateUpdateTracker} OR ${testDateUpdateBikes} OR ${testDateUpdateBatterie} OR ${testDateUpdateLocks})`;
        if (conditions.trim() === "") {
            conditions = ` WHERE ${lastUpdateString}`;
        } else {
            conditions = `${conditions} AND ${lastUpdateString}`;
        }
        queryString = conditions + resultConfig;
    }

    console.log("[QUERY-STRING]", queryString);
    if (lng !== null && lat !== null) {
        values = [lng, lat, perimeter, ...values];

        query = `WITH ctx_trackers AS (SELECT *
                                       FROM trackers
                                       WHERE ST_DWithin(ST_SetSRID(coordinates, 4326), ST_MakePoint(?, ?)::geography, ?)
                                         AND status = 'ACTIVE')
                 SELECT bk.*,
                        t.coordinates as coordinates,
                        t.coordinates as marker_coordinates,
                        bt.soc        as capacity,
                        bt.capacity   as current_capacity,
                        52            as full_capacity,
                        l.state       AS lock_state,
                        l.uuid        AS lock_uuid,
                        'BIKE'        as marker_type
                 FROM ctx_trackers t
                          LEFT JOIN bikes bk
                                    ON bk.id = t.bike_id
                          LEFT JOIN batteries bt
                                    ON bt.bike_id = bk.id AND bt.status = 'ACTIVE'
                          LEFT JOIN locks l
                                    ON bk.id = l.bike_id AND l.status = 'ACTIVE'
                                        ${queryString}`;
    } else {
        query = `SELECT bk.*,
                        t.coordinates as coordinates,
                        t.coordinates as marker_coordinates,
                        bt.capacity   as capacity,
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
                                        ${queryString}`;
    }

    console.log(values);
    const response = await getSequelize().query<BikeClient>(query, {
        replacements: values,
        raw: false,
        type: QueryTypes.SELECT
    });

    return {
        total: response.length,
        lastUpdate: Math.floor(new Date().getTime() / 1000),
        rows: response
    };
};
