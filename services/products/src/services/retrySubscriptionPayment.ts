import { RETURN_URL_SUBSCRIPTION, STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { SUBSCRIPTION_STATUS,UserSubscriptionsModel} from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

export const retrySubscriptionPayment = async (providerSubscriptionId: string, providerPaymentMethodId: string) => {
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" ||
            typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }

        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        const paymentIntent = await stripeApi.retrySubscriptionPayment(providerSubscriptionId, providerPaymentMethodId, RETURN_URL_SUBSCRIPTION);
        const pStatus = paymentIntent.status ? paymentIntent.status.toLowerCase() : "other";
        if (pStatus === "requires_action") {
            const redirectUrl = paymentIntent.next_action?.redirect_to_url?.url ?? null;
            return {
                statusCode: 200,
                result: {
                    redirectUrl: redirectUrl,
                    client_secret: paymentIntent.client_secret,
                    status: pStatus
                }
            };
        } else if (pStatus === "succeeded") {
            await UserSubscriptionsModel.update({
                status: SUBSCRIPTION_STATUS.ACTIVE,
                total_usage: 0
            }, {
                where: {
                    id: providerSubscriptionId
                }
            });

            return {
                statusCode: 204
            };
        } else {
            return {
                statusCode: 500,
                result: pStatus
            };
        }
    } catch (error) {
        console.log("[ERROR] providerSubscriptionId : ", providerSubscriptionId);
        console.log("[ERROR] providerPaymentMethodId : ", providerPaymentMethodId);
        throw error;
    }
};
