import {putRoles} from "../services/putRoles";
import {HandlerWithTokenAuthorizerBuilder, PutRolesInput,PutRolesOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutRolesInput, PutRolesOutput>(async request => {
    const body = request.body;
    if(!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await putRoles(body);
});
