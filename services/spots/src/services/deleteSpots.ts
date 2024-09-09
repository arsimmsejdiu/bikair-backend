import { CitySpotsModel } from "@bikairproject/lib-manager";

export const deleteSpots = async (spotId: number) => {
    try {
        await CitySpotsModel.destroy({
            where: {
                id: spotId
            }
        });
        return {
            statusCode: 200,
            result: spotId
        };
    } catch (error) {
        console.log("[ERROR] spotId : ", spotId);
        throw error;
    }
};
