import { GetCities } from "../dao/GetCities";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const getCities = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetCities(query);

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
