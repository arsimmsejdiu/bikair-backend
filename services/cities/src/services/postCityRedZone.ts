import {
    CitiesModel,
    CityRedZonesModel,
    closeConnection,
    loadSequelize, Polygon,
    PostCreateCityRedZoneInput,
} from "@bikairproject/lib-manager";

export const postCityRedZone = async (body: Partial<PostCreateCityRedZoneInput>) => {
    try {
        await loadSequelize();
        if (!body.name && !body.status || !body.polygon) {
            return {
                statusCode: 400,
                result: "Missing parameters"
            }
        }
        const {
            name = null,
            status = "ACTIVE",
            city_id,
            polygon,
            city_name
        } = body;

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

        const coordinatesString = JSON.stringify(body.polygon.coordinates);

        // Parse the coordinates string into an array of coordinate pairs
        const coordinatesPairs = coordinatesString.split(",").map(coordPair => {
            const [lon, lat] = coordPair.trim().split(" ").map(parseFloat);
            if(isNaN(lon) || isNaN(lat)) {
                throw new Error("Invalid coordinates format")
            }
            return [lon, lat]
        });

        coordinatesPairs.push(coordinatesPairs[0]);



        const poly: Polygon= {
            type: "Polygon",
            coordinates: [coordinatesPairs]
        };

        const cityRedZone = await CityRedZonesModel.create({
            name: name ?? "",
            city_id: cityId,
            polygon: poly,
            status: status
        });

        return {
            statusCode: 201,
            result: cityRedZone
        }
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    } finally {
        await closeConnection();
    }
};
