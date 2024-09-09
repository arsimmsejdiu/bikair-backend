import {
    CitiesModel,
    CityPolygonsModel,
    closeConnection,
    loadSequelize,
    PostCreateCityPolygonInput,
} from "@bikairproject/lib-manager";

export const postCityPolygon = async (body: Partial<PostCreateCityPolygonInput>) => {
    try {
        await loadSequelize();
        if (!body.name && !body.status || !body.polygon) {
            return {
                statusCode: 400,
                result: "Missing parameters"
            }
        }
        const {name = null, status = "ACTIVE", city_id, polygon, city_name} = body;

        let cityId = city_id;
        if (typeof cityId === "undefined") {
            const city = await CitiesModel.findOne({
                where: {
                    name: city_name
                }
            });
            cityId = city?.id
        }
        if (!cityId) {
            return {
                statusCode: 404,
                result: "City not found"
            }
        }

        let poly;
        poly = {
            type: "Polygon",
            coordinates: [polygon]
        };

        const cityPolygon = await CityPolygonsModel.create({
            name: name ?? "",
            city_id: cityId,
            polygon: poly,
            status: status
        });

        return {
            statusCode: 201,
            result: cityPolygon
        }
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    } finally {
        await closeConnection();
    }
};
