import {CitiesModel, CityPolygonsModel, SelectBuilderConf, STATUS} from "@bikairproject/lib-manager";
import {GetPolygons} from "../dao/GetPlygons";
/**
 *
 * @returns
 */
export const getCityPolygons = async (query: SelectBuilderConf | null) => {
    try {
        const result  = await GetPolygons(query);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
