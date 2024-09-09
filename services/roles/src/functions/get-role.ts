import {getRole} from "../services/getRole";
import {GetRoleInput,GetRoleOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetRoleInput, GetRoleOutput>(async request => {
    const id = Number(request.pathParams?.role_id);
    if (Number.isNaN(id)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    return await getRole(id);
    //AVAILABLE_READ, MAINTENANCE_READ, BOOKED_READ
});
