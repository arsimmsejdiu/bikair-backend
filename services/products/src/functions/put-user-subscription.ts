import {updateUserSubscription} from "../services/updateUserSubscription";
import {HandlerWithTokenAuthorizerBuilder, PutUserSubscriptionInput,PutUserSubscriptionOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutUserSubscriptionInput, PutUserSubscriptionOutput>(async request => {
    const body = request.body;
    const locale = request.locale;
    const subscriptionId = Number(request.pathParams?.subscription_id);

    if (Number.isNaN(subscriptionId)) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }

    console.log("call  addUserProduct");
    return await updateUserSubscription(subscriptionId, body, locale);
});
