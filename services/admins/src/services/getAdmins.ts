import GetAdmins from "../dao/GetAdmins";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const getAdmins = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetAdmins(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
