import { Stripe } from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { PaymentMethodHookType } from "../models/PaymentMethodHookType";
import { getCustomerId } from "./stripeService";
import { PaymentMethodsModel, UsersModel } from "@bikairproject/database";
import { STATUS } from "@bikairproject/shared";
import { StripeApi } from "@bikairproject/stripe-api";

export const handlePaymentMethodEvents = async (hookType: PaymentMethodHookType, paymentMethod: Stripe.PaymentMethod) => {
    switch (hookType) {
        case "payment_method.attached":
            return await handlePaymentMethodAttachedEvents(paymentMethod);
        case "payment_method.detached":
            return await handlePaymentMethodDetachedEvents(paymentMethod);
        case "payment_method.updated":
        case "payment_method.card_automatically_updated":
            return await handlePaymentMethodUpdatedEvents(paymentMethod);
        default:
            return `Hook ${hookType} not handled for trips`;
    }
};

export const handlePaymentMethodAttachedEvents = async (paymentMethod: Stripe.PaymentMethod) => {
    // Ensure you attach card to stripe customer before saving in ou DB in case of stripe rejection
    if (!paymentMethod.card) {
        return "Missing card informations";
    }
    const customerId = getCustomerId(paymentMethod);

    const user = await UsersModel.findOne({
        where: {
            stripe_customer: customerId
        }
    });

    if (!user?.stripe_customer) {
        return "Missing user informations";
    }

    await PaymentMethodsModel.update({
        status: STATUS.INACTIVE
    }, {
        where: {
            user_id: user.id
        }
    });

    const existingCard = await PaymentMethodsModel.findOne({
        where: {
            card_token: paymentMethod.id
        }
    });

    if (existingCard) {
        await PaymentMethodsModel.update({
            brand: paymentMethod.card.brand,
            country: paymentMethod.card.country,
            exp_year: paymentMethod.card.exp_year,
            exp_month: paymentMethod.card.exp_month,
            last_4: Number(paymentMethod.card.last4),
            status: STATUS.ACTIVE
        }, {
            where: {
                card_token: paymentMethod.id
            }
        });
    } else {
        const newCard = await PaymentMethodsModel.create({
            card_token: paymentMethod.id,
            brand: paymentMethod.card.brand,
            country: paymentMethod.card.country,
            user_id: user.id,
            exp_year: paymentMethod.card.exp_year,
            exp_month: paymentMethod.card.exp_month,
            last_4: Number(paymentMethod.card.last4),
            status: STATUS.ACTIVE
        });
        console.log("[new card]", newCard);
    }

    return "ok";
};

export const handlePaymentMethodDetachedEvents = async (paymentMethod: Stripe.PaymentMethod) => {
    const paymentMethodDettached = await PaymentMethodsModel.findOne({
        where: {
            card_token: paymentMethod.id
        }
    });

    if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
        return "Missing stripe key env value";
    }

    await PaymentMethodsModel.destroy({
        where: {
            card_token: paymentMethod.id
        }
    });

    const user = await UsersModel.findOne({
        where: {
            id: paymentMethodDettached?.user_id
        }
    });

    if (!user?.stripe_customer) {
        return "Missing user informations";
    }

    const previousPM = await PaymentMethodsModel.findOne({
        where: {
            user_id: user.id
        },
        order: [
            ["id", "desc"]
        ]
    });

    if(previousPM) {
        const stripe = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);
        await stripe.setDefaultCardToCustomer(user.stripe_customer, previousPM.card_token);
        await PaymentMethodsModel.update({
            status: STATUS.ACTIVE
        }, {
            where: {
                id: previousPM.id
            }
        });
    }

    return "Ok";
};

export const handlePaymentMethodUpdatedEvents = async (paymentMethod: Stripe.PaymentMethod) => {
    if (!paymentMethod.card) {
        return "Missing card informations";
    }
    await PaymentMethodsModel.update({
        brand: paymentMethod.card.brand,
        country: paymentMethod.card.country,
        exp_year: paymentMethod.card.exp_year,
        exp_month: paymentMethod.card.exp_month,
        last_4: Number(paymentMethod.card.last4)
    }, {
        where: {
            card_token: paymentMethod.id
        }
    });

    return "Ok";
};
