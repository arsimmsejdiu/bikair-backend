import { getSpot } from "./getSpot";
import { generatePolygonBaseAroundCenterPoint } from "./helpers";
import { CitiesModel, CitySpotsModel,CitySpotsUpdate, Point, Polygon,PutUpdateSpotsInput } from "@bikairproject/lib-manager";

export const updateSpot = async (body: PutUpdateSpotsInput) => {
    try {
        if (!body.id || !body.name || !body.city_name || !body.max_bikes) {
            console.log("Missing required params");
            return {
                statusCode: 400,
                result: "Missing parameters"
            };
        }
        const {
            id,
            name,
            city_name,
            address,
            max_bikes,
            app_client,
            app_tech,
            status
        } = body;

        const latitude = Number(body.latitude);
        const longitude = Number(body.longitude);

        const city = await CitiesModel.findOne({
            where: {
                name: city_name
            }
        });

        if (!city) {
            return {
                statusCode: 404,
                result: "City not found"
            };
        }

        const newSpot: CitySpotsUpdate = {
            id: id,
            city_id: city.id,
            name: name,
            address: address,
            max_bikes: max_bikes,
            status: status,
            app_client:  app_client,
            app_tech: app_tech
        };

        if (!latitude || !longitude) {
            newSpot.coordinates = null;
            newSpot.polygon = null;
        } else {
            const polygon = generatePolygonBaseAroundCenterPoint(
                latitude,
                longitude,
                max_bikes
            );
            const point: Point = { type: "Point", coordinates: [longitude, latitude] };
            const poly: Polygon = { type: "Polygon", coordinates: [polygon] };

            newSpot.coordinates = point;
            newSpot.polygon = poly;
        }

        await CitySpotsModel.update(newSpot, {
            where: {
                id: newSpot.id
            }
        });
        const citySpot = await getSpot(id);

        return {
            statusCode: 200,
            result: citySpot.result
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
