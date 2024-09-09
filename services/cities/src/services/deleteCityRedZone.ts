import {CityRedZonesModel} from "@bikairproject/lib-manager";

export const deleteCityRedZone = async (cityRedZoneId: number) => {
    try {
        await CityRedZonesModel.destroy({
            where: {
                id: cityRedZoneId
            }
        });
        return {
            statusCode: 200,
            result: cityRedZoneId
        };
    } catch (error) {
        console.log("[ERROR] cityRedZoneId : ", cityRedZoneId);
        throw error;
    }
}
