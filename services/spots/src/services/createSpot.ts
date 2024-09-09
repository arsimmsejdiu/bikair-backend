import { generatePolygonBaseAroundCenterPoint } from "./helpers";
import { CitiesModel, CitySpotsModel, closeConnection, loadSequelize,Point, Polygon,PostCreateSpotsInput  } from "@bikairproject/lib-manager";

export const createSpot = async (body: Partial<PostCreateSpotsInput>) => {
    try {
        await loadSequelize();
        if ((!body.city_name && !body.city_id) || !body.latitude || !body.longitude || !body.max_bikes) {
            console.log("Missing required params");

            return {
                statusCode: 400,
                result: "Missing parameters"
            };
        }
        const radius = body.radius || 0.05;
        const {
            name = null,
            city_name,
            latitude,
            longitude,
            max_bikes,
            address = null,
            city_id,
            status = "ACTIVE",
            app_client = false,
            app_tech = true
        } = body;

        const lat = Number(latitude);
        const lng = Number(longitude);

        let cityId = city_id;
        if(typeof cityId === "undefined") {
            const city = await CitiesModel.findOne({
                where: {
                    name: city_name
                }
            });
            cityId = city?.id;
        }

        if (!cityId) {
            return {
                statusCode: 404,
                result: "City not found"
            };
        }

        const polygon = generatePolygonBaseAroundCenterPoint(
            lat,
            lng,
            max_bikes
        );
        const point: Point = { type: "Point", coordinates: [lng, lat] };
        const poly: Polygon = { type: "Polygon", coordinates: [polygon] };

        const citySpot = await CitySpotsModel.create({
            name: name,
            address: address,
            city_id: cityId,
            max_bikes: max_bikes,
            coordinates: point,
            polygon: poly,
            status: status,
            app_tech: app_tech,
            app_client: app_client
        });

        return {
            statusCode: 201,
            result: citySpot
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    } finally {
        await closeConnection();
    }
};
