import {checkApiKey} from "../services/apiKeyService";
import {ErrorUtils, GetApiKeyInput, GetApiKeyOutput, HandlerWithoutTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithoutTokenAuthorizerBuilder<GetApiKeyInput, GetApiKeyOutput>(async request => {
    const apiKey = request.pathParams?.apiKey ?? request.pathParams?.api_key;
    const origin = request.origin;
    const appVersion = request.appVersion;

    if (typeof apiKey === "undefined" || apiKey === null) {
        ErrorUtils.getSlackErrorPayload("GET /auth/check/api-key", "Missing API Key");
        return {
            statusCode: 409,
            result: "Missing mandatory field"
        };
    }

    if (!origin || !appVersion) {
        return {
            statusCode: 409,
            result: "Missing mandatory field"
        };
    }

    return await checkApiKey(apiKey, appVersion, origin);
});
