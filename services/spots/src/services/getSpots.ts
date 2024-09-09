import { GetSpots } from "../dao/GetSpots";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getSpots = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetSpots(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
