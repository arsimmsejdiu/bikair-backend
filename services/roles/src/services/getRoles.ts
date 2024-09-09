import { GetRoles } from "../dao/GetRoles";
import { SelectBuilderConf } from "@bikairproject/lib-manager";

export const getRoles = async (query: SelectBuilderConf | null) => {
    try {
        const roles = await GetRoles(query)
        return {
            statusCode: 200,
            result: roles
        };
    } catch (error) {
        console.log("[ERROR] getRoles : ");
        throw error;
    }
}
