import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { SUBSCRIPTION_STATUS, UserSubscriptionDetail, UserSubscriptionsModel } from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

export const reactivateUserSubscription = async (subscription: UserSubscriptionDetail, locale: string) => {
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" ||
            typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }

        if (!subscription.provider_subscription_id) {
            return {
                statusCode: 404,
                result: "MISSING_PARAMS"
            };
        }
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        await stripeApi.reactivateSubscription(subscription.provider_subscription_id);
        await UserSubscriptionsModel.update({
            status: SUBSCRIPTION_STATUS.ACTIVE
        }, {
            where: {
                id: subscription.id
            }
        });

        return {
            statusCode: 204
        };

    } catch (error) {
        console.log("[ERROR] subscription : ", subscription);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
