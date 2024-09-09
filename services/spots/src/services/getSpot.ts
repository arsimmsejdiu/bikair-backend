import {QueryTypes} from "sequelize";

import {CitiesModel, CitySpotsModel, getSequelize,GetSpotOutput} from "@bikairproject/lib-manager";

export const getSpot = async (spotId: number) => {
    try {
        const spot = await CitySpotsModel.findByPk(spotId);

        if (!spot) {
            return {
                statusCode: 404,
                result: "Spot not found"
            };
        }

        const city = await CitiesModel.findByPk(spot.city_id);

        const result: GetSpotOutput = spot;
        result.city_name = city?.name;
        if (typeof result.coordinates !== "undefined" && result.coordinates !== null) {
            result.latitude = result.coordinates.coordinates[1];
            result.longitude = result.coordinates.coordinates[0];
        }

        const countResult = await getSequelize().query<{ nb_bikes: number }>(`
            SELECT count(*) as nb_bikes
            from trackers t
            WHERE t.status = 'ACTIVE'
              and ST_DWithin(st_setsrid(t.coordinates, 4326),
                             st_setsrid((select polygon from city_polygons p where id = :spotId), 4326), 0)
        `, {
            replacements: {
                spotId: spot.id
            },
            raw: false,
            plain: true,
            type: QueryTypes.SELECT
        });
        result.nb_bikes = countResult?.nb_bikes ?? 0;

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] spotId : ", spotId);
        throw error;
    }
};
