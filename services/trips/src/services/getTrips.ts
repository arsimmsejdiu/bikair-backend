import { GetTrips } from "../dao/GetTrips";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getTrips = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetTrips(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
