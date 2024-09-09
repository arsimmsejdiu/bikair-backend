import {GetBikes} from "../dao/GetBikes";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getBikes = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetBikes(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
