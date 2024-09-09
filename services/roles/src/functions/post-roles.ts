import {postRoles} from "../services/postRoles";
import {HandlerWithTokenAuthorizerBuilder, PostRolesInput,PostRolesOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostRolesInput, PostRolesOutput>(async request => {
    const body = request.body;
    if(!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await postRoles(body);
});
