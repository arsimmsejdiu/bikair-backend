import { GetBookings } from "../dao/GetBookings";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const getBookings = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetBookings(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
