import { Stripe } from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { SetupIntentHookType } from "../models/SetupIntentHookType";
import { getCustomerId, getPaymentMethodId } from "./stripeService";
import { PaymentMethodsModel, UsersModel } from "@bikairproject/database";
import { STATUS } from "@bikairproject/shared";
import { StripeApi } from "@bikairproject/stripe-api";

export const handleSetupIntentEvents = async (hookType: SetupIntentHookType, setupIntent: Stripe.SetupIntent) => {
    switch (hookType) {
        case "setup_intent.succeeded":
            return await handleSetupIntentSucceededEvents(setupIntent);
        default:
            return `Hook ${hookType} not handled for trips`;
    }
};

export const handleSetupIntentSucceededEvents = async (setupIntent: Stripe.SetupIntent) => {
    if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
        return "Missing stripe key env value";
    }
    const pmId = getPaymentMethodId(setupIntent);

    const customerId = getCustomerId(setupIntent);
    const user = await UsersModel.findOne({
        where: {
            stripe_customer: customerId
        }
    });

    if (!user?.stripe_customer || typeof pmId === "undefined") {
        return "Missing user informations";
    }

    await PaymentMethodsModel.update({
        status: STATUS.INACTIVE
    }, {
        where: {
            user_id: user.id
        }
    });

    await PaymentMethodsModel.update({
        status: STATUS.ACTIVE
    }, {
        where: {
            card_token: pmId
        }
    });

    const stripe = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);
    await stripe.setDefaultCardToCustomer(user.stripe_customer, pmId);

    return "Ok";
};
