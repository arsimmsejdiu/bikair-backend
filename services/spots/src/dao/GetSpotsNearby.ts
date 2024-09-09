import {APIGatewayProxyEventQueryStringParameters} from "aws-lambda";
import {QueryTypes} from "sequelize";

import {getSequelize, GetSpotsNearbyOutputData} from "@bikairproject/lib-manager";

export const GetSpotsNearby = async (query: APIGatewayProxyEventQueryStringParameters | null, origin: string) => {
    const values: any = {};
    let queryString = "";
    if (query?.lat && query?.lng) {
        values.lat = query.lat;
        values.lng = query.lng;
        queryString += "AND ST_DWithin(ST_SetSRID(coordinates, 4326), ST_MakePoint(:lng, :lat)::geography, 3000)";
    }
    const app_type = origin === "MOBILE_APP" ? "app_client" : "app_tech";

    const response = await getSequelize().query<GetSpotsNearbyOutputData>(`
        WITH ctx_city_spots AS (SELECT *
                                FROM city_spots
                                WHERE status = 'ACTIVE'
                                    ${queryString})
        SELECT s.*,
               'SPOT'                                             as marker_type,
               s.coordinates                                      as spot_coordinates,
               s.coordinates                                      as marker_coordinates,
               ST_AsGeoJSON(s.polygon)::json -> 'coordinates'     as city_polygon,
               s.polygon                                          as spot_polygon,
               array_agg(b.id)                                    as bike_ids,
               count(b.id)                                        as nb_bikes
        FROM ctx_city_spots s
                 LEFT OUTER JOIN cities c ON s.city_id = c.id
                 left join bikes b on s.id = b.spot_id
        WHERE ${app_type} = TRUE
        group by s.id, s.uuid, s.city_id, s.created_at, s.updated_at, s.name, s.address, coordinates, max_bikes,
                 s.polygon, s.status, app_client, app_tech
        ORDER BY s.name ASC
    `, {
        replacements: values,
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });

    return {
        total: response.length,
        rows: response
    };
};
