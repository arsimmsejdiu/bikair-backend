import { updateUserSettings } from "../services/updateUserSettings";
import { HandlerWithTokenAuthorizerBuilder,  PutUserSettingsInput,PutUserSettingsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutUserSettingsInput, PutUserSettingsOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const osVersion = request.osVersion ?? "0.0.0";
    const brand = request.device ?? "";

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

    return await updateUserSettings(userId, body, osVersion, brand);
});
