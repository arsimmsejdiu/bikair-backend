import {GetReports} from "../dao/GetReports";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getReports = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetReports(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
