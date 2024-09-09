import {Stripe} from "stripe";

import {STRIPE_SECRET_KEY, STRIPE_TAX_RATES} from "../config/config";
import {InvoiceHookType} from "../models/InvoiceHookType";
import {getPaymentIntentId} from "./stripeService";
import {GetUserDiscountForProduct, UserDiscountsModel, UserSubscriptionsModel} from "@bikairproject/database";
import {STATUS, SUBSCRIPTION_STATUS} from "@bikairproject/shared";
import {StripeApi} from "@bikairproject/stripe-api";

export const handlePassInvoiceEvents = async (hookType: InvoiceHookType, invoice: Stripe.Invoice) => {
    switch (hookType) {
        case "invoice.paid":
            return await handlePassPaymentSuccess(invoice);
        case "invoice.payment_failed":
            return await handlePassPaymentFailed(invoice);
        default:
            return `Hook ${hookType} not handled for trips`;
    }
};

export const handlePassPaymentSuccess = async (invoice: Stripe.Invoice) => {
    const userSubscription = await UserSubscriptionsModel.findOne({
        where: {
            provider_subscription_id: invoice.id
        }
    });
    if (!userSubscription) {
        return "No subscription found";
    }

    // Update status
    await UserSubscriptionsModel.update({
        status: SUBSCRIPTION_STATUS.ACTIVE
    }, {
        where: {
            id: userSubscription.id
        }
    });

    const userDiscount = await GetUserDiscountForProduct(userSubscription.user_id, userSubscription.product_id);
    if (userDiscount) {
        await UserDiscountsModel.update({
            status: STATUS.CLOSED,
            used: true
        }, {
            where: {
                id: userDiscount.id
            }
        });
    }
    // TODO mail pass paid
    // await mailPaidTrip(user, bike, trip, "PAYMENT_SUCCESS");
    return "ok";
};

export const handlePassPaymentFailed = async (invoice: Stripe.Invoice) => {
    if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
        throw "Missing stripe key env value";
    }

    const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

    const paymentIntentId = getPaymentIntentId(invoice);
    if (!paymentIntentId) {
        return "Invoice has not payment intent id";
    }
    const paymentIntent = await stripeApi.findPaymentIntent(paymentIntentId);
    if (paymentIntent.status === "requires_action") {
        return "Require action of customer";
    }

    const userSubscription = await UserSubscriptionsModel.findOne({
        where: {
            provider_subscription_id: invoice.id
        }
    });
    if (!userSubscription) {
        return "No subscription found";
    }

    if (userSubscription.total_usage ?? 0 > 0) {
        // Update status
        await UserSubscriptionsModel.update({
            status: SUBSCRIPTION_STATUS.EXPIRED,
            canceled_note: "Payment failed"
        }, {
            where: {
                id: userSubscription.id
            }
        });

        // TODO mail pass paid
        // await mailPaidTrip(user, bike, trip, "PAYMENT_SUCCESS");
        return "Canceling unpaid pass subscription";
    } else {
        console.log("Deleting unpaid pass subscription");
        if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
            throw "Missing stripe key env value";
        }
        if (!invoice.id) {
            return "Missing invoice id";
        }
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        await stripeApi.cancelInvoice(invoice.id);
        await UserSubscriptionsModel.destroy({
            where: {
                id: userSubscription.id
            }
        });

        // TODO mail pass paid
        // await mailPaidTrip(user, bike, trip, "PAYMENT_SUCCESS");
        return "Deleting unpaid pass subscription";
    }
};
