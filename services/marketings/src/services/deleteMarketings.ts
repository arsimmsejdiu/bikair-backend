import { DeleteMarketings } from "../dao/DeleteMarketings";

export const deleteMarketings = async (id: number) => {
    try {
        await DeleteMarketings(id);

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] deleteMarketings : ");
        throw error;
    }
};
