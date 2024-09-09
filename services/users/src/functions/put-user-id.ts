import { updateUserId } from "../services/updateUserId";
import { HandlerWithTokenAuthorizerBuilder,PutUserOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<any, PutUserOutput>(async request => {
    const body = request.body;
    const userId = Number(request.pathParams?.user_id);

    if (Number.isNaN(userId)) {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    if(!body) {
        return {
            statusCode: 409,
            result: "Body is missing"
        };
    }

    return await updateUserId(userId, body);
});
