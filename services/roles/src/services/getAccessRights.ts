import {GetAccessRights} from "../dao/GetAccessRights";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getAccessRights = async (query: SelectBuilderConf | null) => {
    try {
        const accessRights = await GetAccessRights(query);
        return {
            statusCode: 200,
            result: accessRights
        };
    } catch (error) {
        console.log("[ERROR] getAccessRights : ");
        throw error;
    }
};
