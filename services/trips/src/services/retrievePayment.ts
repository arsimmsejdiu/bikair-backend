import { RETURN_URL_PAYMENT, STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { PaymentMethodsModel, TripsModel, UsersModel } from "@bikairproject/lib-manager";
import { STATUS, TRIP_STATUS } from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

export const retrievePayment = async (userId: number, locale: string) => {
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        const trip = await TripsModel.findOne({
            where: {
                user_id: userId,
                status: [TRIP_STATUS.PAYMENT_HOLD_CONFIRM, TRIP_STATUS.PAYMENT_FAILED, TRIP_STATUS.PAYMENT_INV_CREATED]
            }
        });
        if (!trip) {
            console.log(`No starting trip for user ${userId}`);
            return {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
        }

        let paymentIntent = await stripeApi.findPaymentIntent(trip.payment_intent!);

        if (trip.status === TRIP_STATUS.PAYMENT_FAILED) {
            console.log(`Trip ${trip.id} PAYMENT_FAILED. Retrying payment...`);
            const user = await UsersModel.findByPk(userId);
            const paymentMethod = await PaymentMethodsModel.findOne({
                where: {
                    user_id: userId,
                    status: STATUS.ACTIVE
                }
            });

            if(!trip.payment_intent || !paymentMethod?.card_token || !user?.email) {
                throw "Missing database informations";
            }

            paymentIntent = await stripeApi.retryPayment(trip.payment_intent, paymentMethod.card_token, RETURN_URL_PAYMENT, user.email);
        }

        const redirectUrl = paymentIntent.next_action?.redirect_to_url?.url ?? null;
        console.log(redirectUrl);

        return {
            statusCode: 200,
            result: {
                client_secret: paymentIntent.client_secret,
                paymentIntent: paymentIntent.id,
                status: paymentIntent.status,
                uuid: trip.uuid,
                redirectUrl: redirectUrl
            }
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
