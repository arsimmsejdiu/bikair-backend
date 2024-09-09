import { Stripe } from "stripe";

export const getPaymentIntentId = (invoice: Stripe.Invoice) => {
    let paymentIntentId: string | undefined;
    if(typeof invoice.payment_intent === "string") {
        paymentIntentId = invoice.payment_intent;
    } else {
        paymentIntentId = invoice.payment_intent?.id;
    }
    return paymentIntentId;
};

export const getSubscriptionId = (invoice: Stripe.Invoice) => {
    let subscriptionId: string | undefined;
    if(typeof invoice.subscription === "string") {
        subscriptionId = invoice.subscription;
    } else {
        subscriptionId = invoice.subscription?.id;
    }
    return subscriptionId;
};

export const getCustomerId = (object: Stripe.Invoice | Stripe.PaymentIntent | Stripe.PaymentMethod | Stripe.SetupIntent) => {
    let customerId: string | undefined;
    if(typeof object.customer === "string") {
        customerId = object.customer;
    } else {
        customerId = object.customer?.id;
    }
    return customerId;
};

export const getPaymentMethodId = (object: Stripe.SetupIntent) => {
    let paymentMethodId: string | undefined;
    if(typeof object.payment_method === "string") {
        paymentMethodId = object.payment_method;
    } else {
        paymentMethodId = object.payment_method?.id;
    }
    return paymentMethodId;
};
