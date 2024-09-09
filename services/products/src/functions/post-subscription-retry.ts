import { retrySubscription } from "../services/retrySubscription";
import { HandlerWithTokenAuthorizerBuilder, PostSubscriptionRetryInput,PostSubscriptionRetryOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostSubscriptionRetryInput, PostSubscriptionRetryOutput>(async request => {
    console.log("run middleware");
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    if (!body?.subscription_id) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }

    console.log("call  addUserProduct");
    return await retrySubscription(userId, body, locale);
});
