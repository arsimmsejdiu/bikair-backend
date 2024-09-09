import {CitiesModel, CityPolygonsModel} from "@bikairproject/lib-manager";

export const getCityPolygon = async (cityId: number) => {
    try {
        const cityPolygon = await CityPolygonsModel.findByPk(cityId);

        if(!cityPolygon) {
            return {
                statusCode : 404,
                result: "City polygon not found"
            };
        }

        return {
            statusCode: 200,
            result: cityPolygon
        };
    } catch (error) {
        console.log("[ERROR] cityPolygonId : ", cityId);
        throw error;
    }
}
