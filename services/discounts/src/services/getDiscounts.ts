import { GetDiscounts } from "../dao/GetDiscounts";

const getDiscounts = async (query) => {
    try {
        const result = await GetDiscounts(query);

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};

export default getDiscounts;
