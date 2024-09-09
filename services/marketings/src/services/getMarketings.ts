import { GetMarketings } from "../dao/GetMarketings";
import { SelectBuilderConf } from "@bikairproject/lib-manager";


export const getMarketings = async (query: SelectBuilderConf | null) => {
    try {
        const marketings = await GetMarketings(query);

        return {
            statusCode: 200,
            result: marketings
        };
    } catch (error) {
        console.log("[ERROR] getMarketings : ");
        throw error;
    }
};
