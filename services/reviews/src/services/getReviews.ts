import { GetReviews } from "../dao/GetReviews";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getReviews = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetReviews(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
