import {GetBikeDetail} from "../dao/GetBikeDetail";


export const getBikeDetail = async (bikeId: number) => {
    try {
        const bikeDetail = await GetBikeDetail(bikeId);

        if (bikeDetail === null) {
            return {
                statusCode: 404,
                result: null
            };
        } else {
            return {
                statusCode: 200,
                result: bikeDetail
            };
        }
    } catch (error) {
        console.log("[ERROR] bikeId : ", bikeId);
        throw error;
    }
};
