import {GetBikeStatus} from "../dao/GetBikeStatus";


export const getBikeStatus = async (userId: number, bikeName: string) => {
    try {
        const bikeStatus = await GetBikeStatus(userId, bikeName);

        if (bikeStatus === null) {
            return {
                statusCode: 200,
                result: "NOT_FOUND"
            };
        } else {
            return {
                statusCode: 200,
                result: bikeStatus
            };
        }
    } catch (error) {
        console.log("[ERROR] bikeName : ", bikeName);
        throw error;
    }
};
