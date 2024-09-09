import {GetDeposit} from "../dao/GetDeposits";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getDeposit = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetDeposit(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
