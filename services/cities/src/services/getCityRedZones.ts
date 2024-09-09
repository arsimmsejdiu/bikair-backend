import {CityRedZonesModel, SelectBuilderConf} from "@bikairproject/lib-manager";
import {GetRedZones} from "../dao/GetRedZones";

export const getCityRedZones = async (query: SelectBuilderConf | null) => {

    try {
        const result = await GetRedZones(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
