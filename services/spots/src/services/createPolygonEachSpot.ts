import {GOOGLE_GEOCODING_API_KEY} from "../config/config";
import { generatePolygonBaseAroundCenterPoint } from "./helpers";
import {GoogleMaps} from "@bikairproject/google-api";
import {CitySpotsModel,GeoUtils, Polygon } from "@bikairproject/lib-manager";

export const createPolygonEachSpot = async (cityId: string | null) => {
    try {
        const whereClauseMaybe = cityId ? {where : {city_id: Number(cityId)}} : {};
        const citySpots = await CitySpotsModel.findAll({
            ...whereClauseMaybe,
            order: [
                ["polygon", "DESC"]
            ]
        });
        for (const spot of citySpots) {
            if (spot.coordinates) {
                if (spot.coordinates.coordinates[1] && spot.coordinates.coordinates[0]) {
                    console.log(spot.coordinates.coordinates);
                    const polygon = generatePolygonBaseAroundCenterPoint(
                        spot.coordinates.coordinates[1],
                        spot.coordinates.coordinates[0],
                        spot.max_bikes || 15
                    );
                    let address = await GeoUtils.reverseGeo(spot.coordinates.coordinates[1], spot.coordinates.coordinates[0]);
                    if (address === "NONE" && GOOGLE_GEOCODING_API_KEY) {
                        try {
                            const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                            address = await googleGeoCode.getAddress(spot.coordinates.coordinates[1], spot.coordinates.coordinates[0]);
                        } catch (error: any) {
                            console.log(error);
                        }
                    }
                    const poly: Polygon = { type: "Polygon", coordinates: [polygon] };
                    const addressMaybe = address === "NONE" ? undefined : address;
                    await CitySpotsModel.update({
                        polygon: poly,
                        address: addressMaybe
                    }, {
                        where: {
                            id: spot.id
                        }
                    });
                }
            }
        }

        return {
            statusCode: 200,
            result: "ok"
        };
    } catch (error) {
        console.log("[ERROR] body : ");
        throw error;
    }
};
