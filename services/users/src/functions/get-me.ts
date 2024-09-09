import { getMe } from "../services/getMe";
import { GetMeInput,GetMeOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetMeInput, GetMeOutput>(async request => {
    const userId = request.userId;
    const locale = request.locale;
    const appVersion = request.appVersion;


    if (Number.isNaN(userId) || !appVersion) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getMe(userId, locale, appVersion);
});
