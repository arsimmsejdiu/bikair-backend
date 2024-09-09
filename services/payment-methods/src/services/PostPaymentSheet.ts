import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { UsersModel } from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

const stripeApi = new StripeApi(STRIPE_SECRET_KEY ?? "", STRIPE_TAX_RATES ?? "");

/**
 * @param userId id of the current connected user
 * @returns client_secret string
 */
export const postPaymentSheet = async (userId: number) => {
    try {
        const user = await UsersModel.findByPk(userId);

        if (!user?.stripe_customer) {
            return {
                statusCode: 404,
                result: "No User found"
            };
        }

        const customerId = user.stripe_customer;
        const clientSecrets = await stripeApi.createPaymentSheet(customerId);

        return {
            statusCode: 200,
            result: clientSecrets
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
