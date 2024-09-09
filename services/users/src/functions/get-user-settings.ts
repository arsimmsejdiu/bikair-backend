import { getUserSettings } from "../services/getUserSettings";
import { GetUserSettingsInput,GetUserSettingsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserSettingsInput, GetUserSettingsOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getUserSettings(userId);
});
