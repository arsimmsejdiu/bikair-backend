import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { PostPaymentMethodsRegisterInput,UsersModel} from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

const stripeApi = new StripeApi(STRIPE_SECRET_KEY ?? "", STRIPE_TAX_RATES ?? "");

/**
 * @param body object request
 * @param userId id of the current connected user
 * @returns client_secret string
 */
export const postPaymentMethodsRegister = async (body: PostPaymentMethodsRegisterInput, userId: number) => {
    try {
        const { number, expMonth, expYear, cvc } = body;

        if(!number || !expMonth || !expYear) {
            return {
                statusCode: 404,
                result: "Missing parameters"
            };
        }

        const cardInfo = {
            number: number,
            exp_month: expMonth,
            exp_year: expYear,
            cvc: cvc
        };
        const user = await UsersModel.findByPk(userId);

        if (!user?.stripe_customer) {
            return {
                statusCode: 404,
                result: "No User found"
            };
        }

        const customer = user.stripe_customer;
        const intentState = await stripeApi.registerPaymentMethod(customer, cardInfo);

        return {
            statusCode: 200,
            result: intentState
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
