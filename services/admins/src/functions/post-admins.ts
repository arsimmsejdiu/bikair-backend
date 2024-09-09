import { createAdmins } from "../services/createAdmins";
import { HandlerWithTokenAuthorizerBuilder,PostAdminsInput, PostAdminsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostAdminsInput, PostAdminsOutput>(async request => {
    if (typeof request.body === "undefined") {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await createAdmins(request.body, request.locale);
});
