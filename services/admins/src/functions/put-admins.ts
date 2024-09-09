import { updateAdmins } from "../services/updateAdmins";
import { HandlerWithTokenAuthorizerBuilder, PutAdminsInput, PutAdminsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutAdminsInput, PutAdminsOutput>(async request => {
    if (typeof request.body === "undefined") {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await updateAdmins(request.body, request.locale);
});
