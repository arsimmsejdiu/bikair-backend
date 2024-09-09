import { Stripe } from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { InvoiceHookType } from "../models/InvoiceHookType";
import { getSubscriptionId } from "./stripeService";
import { UserInvoicesModel, UserSubscriptionsModel } from "@bikairproject/database";
import { SUBSCRIPTION_STATUS, USER_INVOICE_STATUS } from "@bikairproject/shared";
import { StripeApi } from "@bikairproject/stripe-api";

export const handleSubscriptionInvoiceEvents = async (hookType: InvoiceHookType, invoice: Stripe.Invoice) => {
    switch (hookType) {
        case "invoice.paid":
            return await handleSubscriptionInvoicePaidEvent(invoice);
        case "invoice.payment_failed":
            return await handleSubscriptionInvoiceFailedEvent(invoice);
        case "invoice.created":
            return await handleSubscriptionInvoiceCreatedEvent(invoice);
        default:
            return `Hook ${hookType} not handled for trips`;
    }
};

export const handleSubscriptionInvoicePaidEvent = async (invoice: Stripe.Invoice) => {
    const subscriptionId = getSubscriptionId(invoice);
    if (!subscriptionId) {
        return "No subscription found !";
    }

    const userSubscription = await UserSubscriptionsModel.findOne({
        where: {
            provider_subscription_id: subscriptionId
        }
    });
    if (!userSubscription) {
        return "No user subscription found";
    }

    let nextBillingDate: Date | undefined;
    if (invoice.lines.object === "list") {
        nextBillingDate = new Date(invoice.lines.data[0].period.end * 1000);
    }

    // Update status
    await UserSubscriptionsModel.update({
        status: SUBSCRIPTION_STATUS.ACTIVE,
        next_billing_date: nextBillingDate,
        total_usage: 0
    }, {
        where: {
            id: userSubscription.id
        }
    });

    const userInvoice = await UserInvoicesModel.findOne({
        where: {
            provider_invoice_id: invoice.id
        }
    });

    if (!userInvoice && invoice.id) {
        await UserInvoicesModel.create({
            subscription_id: userSubscription.id,
            provider_invoice_id: invoice.id,
            amount: invoice.amount_paid,
            status: USER_INVOICE_STATUS.PAID
        });
    } else {
        await UserInvoicesModel.update({
            amount: invoice.amount_paid,
            status: USER_INVOICE_STATUS.PAID
        }, {
            where: {
                provider_invoice_id: invoice.id
            }
        });
    }

    // TODO mail pass paid
    // await mailPaidTrip(user, bike, trip, "PAYMENT_SUCCESS");
    return "ok";
};

export const handleSubscriptionInvoiceFailedEvent = async (invoice: Stripe.Invoice) => {
    if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
        throw "Missing stripe key env value";
    }

    const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

    let nextBillingDate: Date | undefined;
    const pastDue = new Date();
    pastDue.setDate(pastDue.getDate() - 2);
    let currentBillingDate: Date = pastDue;
    if (invoice.lines.object === "list") {
        nextBillingDate = new Date(invoice.lines.data[0].period.end * 1000);
        currentBillingDate = new Date(invoice.lines.data[0].period.start * 1000);
    }

    console.log(`${currentBillingDate.getTime()} <= ${pastDue.getTime()} = `, currentBillingDate.getTime() <= pastDue.getTime());
    const isPaymentPastDue = currentBillingDate.getTime() <= pastDue.getTime();
    console.log("isPaymentPastDue = ", isPaymentPastDue);

    const subscriptionId = getSubscriptionId(invoice);
    if (!subscriptionId) {
        return "No subscription found !";
    }

    const userSubscription = await UserSubscriptionsModel.findOne({
        where: {
            provider_subscription_id: subscriptionId
        }
    });
    if (!userSubscription) {
        return "No user subscription found";
    }

    const userInvoice = await UserInvoicesModel.findOne({
        where: {
            provider_invoice_id: invoice.id
        }
    });

    if(isPaymentPastDue) {
        await stripeApi.removeSubscription(subscriptionId);

        await UserSubscriptionsModel.update({
            status: SUBSCRIPTION_STATUS.EXPIRED,
            next_billing_date: currentBillingDate
        }, {
            where: {
                id: userSubscription.id
            }
        });
    } else {
        // Update status
        await UserSubscriptionsModel.update({
            status: SUBSCRIPTION_STATUS.UNPAID,
            next_billing_date: nextBillingDate
        }, {
            where: {
                id: userSubscription.id
            }
        });

        if (!userInvoice && invoice.id) {
            await UserInvoicesModel.create({
                subscription_id: userSubscription.id,
                provider_invoice_id: invoice.id,
                amount: invoice.amount_due,
                status: USER_INVOICE_STATUS.UNPAID
            });
        } else {
            await UserInvoicesModel.update({
                amount: invoice.amount_due,
                status: USER_INVOICE_STATUS.UNPAID
            }, {
                where: {
                    provider_invoice_id: invoice.id
                }
            });
        }
    }

    // TODO mail pass paid
    // await mailPaidTrip(user, bike, trip, "PAYMENT_SUCCESS");
    return "Ok";
};

export const handleSubscriptionInvoiceCreatedEvent = async (invoice: Stripe.Invoice) => {
    if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
        throw "Missing stripe key env value";
    }

    const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

    if (!invoice.id) {
        return "Missing invoice id";
    }

    const subscriptionId = getSubscriptionId(invoice);
    if (!subscriptionId) {
        return "Invoice has not subscription id";
    }
    const subscription = await stripeApi.findSubscription(subscriptionId);

    await stripeApi.updateInvoice(invoice.id, subscription.metadata);

    return "Ok";
};

export const handleSubscriptionCancelEvent = async (subscription: Stripe.Subscription) => {
    await UserSubscriptionsModel.update({
        status: SUBSCRIPTION_STATUS.EXPIRED,
        canceled_note: "Expired after stripe send delete event."
    }, {
        where: {
            provider_subscription_id: subscription.id
        }
    });
    return "Ok";
};

export const handleSubscriptionUpdateEvent = async (subscription: Stripe.Subscription) => {
    if(subscription.status === "incomplete_expired") {
        await UserSubscriptionsModel.update({
            status: SUBSCRIPTION_STATUS.EXPIRED,
            canceled_note: "Expired after stripe updated subscription with incomplete_expired state."
        }, {
            where: {
                provider_subscription_id: subscription.id
            }
        });
    } else if(subscription.status === "canceled") {
        await UserSubscriptionsModel.update({
            status: SUBSCRIPTION_STATUS.EXPIRED,
            canceled_note: "Expired after stripe updated subscription with canceled state."
        }, {
            where: {
                provider_subscription_id: subscription.id
            }
        });
    } else if(subscription.status === "past_due") {
        await UserSubscriptionsModel.update({
            status: SUBSCRIPTION_STATUS.UNPAID
        }, {
            where: {
                provider_subscription_id: subscription.id
            }
        });
    } else {
        return `No action for status ${subscription.status}`;
    }

    return "Ok";
};
