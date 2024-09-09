import {CityPolygonsModel} from "@bikairproject/lib-manager";

export const deleteCityPolygon = async (cityPolygonId: number) => {
    try {
        await CityPolygonsModel.destroy({
            where: {
                id: cityPolygonId
            }
        });
        return {
            statusCode: 200,
            result: cityPolygonId
        };
    } catch (error) {
        console.log("[ERROR] cityPolygonId : ", cityPolygonId);
        throw error;
    }
}
