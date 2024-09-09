import { Stripe } from "stripe";

import { PaymentIntentHookType } from "../models/PaymentIntentHookType";
import { getCustomerId } from "./stripeService";
import { TripDepositsModel, UsersModel } from "@bikairproject/database";


export const handleDepositPaymentIntentEvent = async (hookType: PaymentIntentHookType, paymentIntent: Stripe.PaymentIntent) => {
    let result = "Ok";
    switch (hookType) {
        case "payment_intent.canceled":
            result = await updateDepositStatus(paymentIntent.id, "INACTIVE");
            break;
        case "payment_intent.amount_capturable_updated":
            result = await handleDepositPaymentIntentAmountCapturableUpdatedEvent(paymentIntent);
            break;
        case "payment_intent.succeeded":
            if (paymentIntent.amount_capturable === 0) {
                result = await updateDepositStatus(paymentIntent.id, "CAPTURED", paymentIntent.amount_received);
            }
            break;
        case "payment_intent.payment_failed":
            result = await updateDepositStatus(paymentIntent.id, "FAILED");
            break;
        case "payment_intent.requires_action":
            result = await updateDepositStatus(paymentIntent.id, "ON_HOLD");
            break;
        default:
            break;
    }


    return result;
};

const handleDepositPaymentIntentAmountCapturableUpdatedEvent = async (paymentIntent: Stripe.PaymentIntent) => {
    // Ensure you render inactive all deposit before processing
    const cusId = getCustomerId(paymentIntent);
    if (!cusId) {
        return "No cusId found !";
    }
    const user = await UsersModel.findOne({
        where: {
            stripe_customer: cusId
        }
    });
    if (user) {
        await TripDepositsModel.update({
            status: "INACTIVE"
        }, {
            where: {
                user_id: user.id
            }
        });
    } else {
        return `No user found for ${cusId}`;
    }
    return await updateDepositStatus(paymentIntent.id, "ACTIVE");
};

const updateDepositStatus = async (paymentIntentId: string, status: string, amountCaptured?: number) => {
    const amountCapturedMaybe = amountCaptured ? { withdrawed_amount: amountCaptured } : {};
    const [affectedCount] = await TripDepositsModel.update({
        status: status,
        ...amountCapturedMaybe
    }, {
        where: {
            payment_intent: paymentIntentId
        }
    });
    if (affectedCount === 0) {
        return "No trip deposit found";
    } else {
        return "Ok";
    }
};
