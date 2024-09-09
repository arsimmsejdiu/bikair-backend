import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { UsersModel } from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

const stripeApi = new StripeApi(STRIPE_SECRET_KEY ?? "", STRIPE_TAX_RATES ?? "");

export const getPaymentIntentSecret = async (userId: number) => {
    try {
        const user = await UsersModel.findByPk(userId);

        if (!user?.stripe_customer) {
            return {
                statusCode: 404,
                result: "No User found"
            };
        }

        const customer = user.stripe_customer;
        const currency = "eur";
        const amount = 100;
        const clientSecret = await stripeApi.createPaymentSecret(amount, currency, customer);

        return {
            statusCode: 200,
            result: clientSecret
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
