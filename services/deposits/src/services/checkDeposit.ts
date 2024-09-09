import {STRIPE_SECRET_KEY, STRIPE_TAX_RATES} from "../config/config";
import {findRentalGroup} from "./findRentalGroup";
import {PaymentMethodsModel, STATUS, TripDepositsModel, UsersModel} from "@bikairproject/lib-manager";
import {StripeApi} from "@bikairproject/stripe-api";

const checkDeposit = async (userId: number, locale: string) => {
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        console.log("Search active deposit in Bik'Air database...");
        const user = await UsersModel.findByPk(userId);
        if (!user?.stripe_customer) {
            return {
                statusCode: 404,
                result: "No User found"
            };
        }

        console.log("Verify if we can use an existing deposit...");
        await findRentalGroup(userId);

        const activeDeposit = await TripDepositsModel.findOne({
            where: {
                user_id: userId,
                status: STATUS.ACTIVE
            }
        });

        if (activeDeposit?.payment_intent) {
            // Ensure deposit is still active on stripe
            const paymentIntent = await stripeApi.findPaymentIntent(activeDeposit.payment_intent);

            if (paymentIntent.canceled_at === null) {
                // Deposit is NOT canceled
                const redirectUrl = paymentIntent.next_action?.redirect_to_url?.url ?? null;
                return {
                    statusCode: 200,
                    result: {
                        client_secret: paymentIntent.client_secret,
                        paymentIntent: paymentIntent.id,
                        status: paymentIntent.status,
                        depositId: null,
                        redirectUrl: redirectUrl
                    }
                };
            }
        }
        console.log("Retrieve user payment methods...");
        const paymentMethod = await PaymentMethodsModel.findOne({
            where: {
                user_id: userId,
                status: STATUS.ACTIVE
            }
        });
        if (!paymentMethod) {
            return {
                statusCode: 404,
                result: "MISSING_PM"
            };
        }
        console.log("Retrieve user payment methods...");
        const newDeposit = await stripeApi.createDeposit(
            user.stripe_customer,
            paymentMethod.card_token,
            "DEPOSIT_MESSAGE"
        );
        console.log(`Deposit status : ${newDeposit.status}`);


        const status = newDeposit.status === "requires_capture" ? STATUS.ACTIVE : "ON_HOLD";
        console.log("Update previous deposit status to `INACTIVE` to Bik'Air database...");
        await TripDepositsModel.update({
            status: STATUS.INACTIVE
        }, {
            where: {
                user_id: userId
            }
        });
        console.log("Save deposit to Bik'Air database...");
        const deposit = await TripDepositsModel.create({
            payment_intent: newDeposit.id,
            status: status,
            user_id: userId
        });

        const redirectUrl = newDeposit.next_action && newDeposit.next_action.redirect_to_url ? newDeposit.next_action.redirect_to_url.url : null;
        const depositStatus = newDeposit.status;

        return {
            statusCode: 200,
            result: {
                client_secret: newDeposit.client_secret,
                paymentIntent: newDeposit.id,
                depositId: deposit ? deposit.id : null,
                status: depositStatus,
                redirectUrl: redirectUrl
            }
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};

export default checkDeposit;
