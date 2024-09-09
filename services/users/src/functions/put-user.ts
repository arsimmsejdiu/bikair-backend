import { updateUser } from "../services/updateUser";
import { HandlerWithTokenAuthorizerBuilder,  PutUserInput,PutUserOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutUserInput, PutUserOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const os = request.device ?? "Unknown";
    const clientVersion = request.appVersion ?? "0.0.0";
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    if(!body) {
        return {
            statusCode: 400,
            result: "Body is missing"
        };
    }

    return await updateUser(userId, body, clientVersion, os, locale);
});
