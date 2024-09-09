import { findPositionHistoryForBikeId } from "@bikairproject/lib-manager";

export const getBikesPositionHistory = async (bikeId) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();
    try {
        const result = await findPositionHistoryForBikeId(bikeId, startDate, endDate);
        console.log("[INFO] result : ", result);

        if (result === null) {
            return {
                statusCode: 404,
                result: null
            };
        } else {
            return {
                statusCode: 200,
                result: result.map(r => {
                    return {
                        coordinates: [r.coordinates.coordinates[1], r.coordinates.coordinates[0]],
                        created_at: r.created_at
                    };
                })
            };
        }
    } catch (error) {
        console.log("[ERROR] query : ", bikeId);
        throw error;
    }
};
