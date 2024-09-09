import { findFunctionalitiesForCity, nearByCity } from "@bikairproject/lib-manager";

export const getUserFunctionalities = async (context: string, query?: any) => {
    try {
        const lat = Number(query?.lat);
        const lng = Number(query?.lng);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return {
                statusCode: 400,
                result: null
            };
        }

        const city = await nearByCity(lat, lng);
        if (city) {
            const functionalities = await findFunctionalitiesForCity(city.id, context);
            return {
                statusCode: 200,
                result: {
                    functionalities: functionalities.map((el) => el.name),
                    city_id: city.id,
                    city_name: city.name
                }
            };
        } else {
            return {
                statusCode: 404,
                result: null
            };
        }

    } catch (error) {
        console.log("[ERROR] context : ", context);
        console.log("[ERROR] query : ", query);
        console.log("[ERROR] while listing functionalities : ", error);
        throw error;
    }
};
