import GetEvents from "../dao/GetEvents";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

const getEvents = async (query: SelectBuilderConf | null) => {
    try {
        const result = await GetEvents(query);

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};

export default getEvents;
