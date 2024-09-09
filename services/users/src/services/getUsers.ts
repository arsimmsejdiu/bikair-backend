import { GetUsers } from "../dao/GetUsers";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const getUsers = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetUsers(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
