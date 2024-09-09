import { Stripe } from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { ChargeHookType } from "../models/ChargeHookType";
import { InvoiceHookType } from "../models/InvoiceHookType";
import { getPaymentIntentId } from "./stripeService";
import { BikesModel, TripsModel, TripStatusModel, UsersModel } from "@bikairproject/database";
import { mailPaidTrip } from "@bikairproject/mailing";
import { TRIP_STATUS } from "@bikairproject/shared";
import { StripeApi } from "@bikairproject/stripe-api";

export const handleTripInvoiceEvents = async (hookType: InvoiceHookType, invoice: Stripe.Invoice) => {
    switch (hookType) {
        case "invoice.paid":
            return await handleTripPaymentSuccess(invoice);
        case "invoice.payment_failed":
            return await handleTripPaymentFailed(invoice);
        default:
            return `Hook ${hookType} not handled for trips`;
    }
};

export const handleTripPaymentSuccess = async (invoice: Stripe.Invoice) => {
    const paymentIntentId = getPaymentIntentId(invoice);
    if (!paymentIntentId) {
        return "No payment intent found !";
    }

    const trip = await TripsModel.findOne({
        where: {
            payment_intent: paymentIntentId
        }
    });
    if (!trip) {
        return "No trip found";
    }

    // Update status
    await updateTripStatus(trip.id, TRIP_STATUS.PAYMENT_SUCCESS);

    const user = await UsersModel.findByPk(trip.user_id);
    const bike = await BikesModel.findByPk(trip.bike_id);

    await mailPaidTrip(user, bike, trip, TRIP_STATUS.PAYMENT_SUCCESS);
    return "ok";
};

export const handleTripPaymentFailed = async (invoice: Stripe.Invoice) => {
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

    // Get trip infos
    const trip = await TripsModel.findOne({
        where: {
            payment_intent: paymentIntentId
        }
    });
    if (!trip) {
        return "No trip found";
    }

    // Ensure status is not already successed
    if (trip.status === "PAYMENT_SUCCESS") {
        return "Trip is already with PAYMENT_SUCCESS status";
    }

    // Update status
    await updateTripStatus(trip.id, "PAYMENT_FAILED");

    const bike = await BikesModel.findByPk(trip.bike_id);
    const user = await UsersModel.findByPk(trip.user_id);

    await mailPaidTrip(user, bike, trip, "PAYMENT_FAILED");

    return "ok";
};

export const updateTripStatus = async (tripId: number, status: string) => {
    await TripsModel.update({
        status: status
    }, {
        where: {
            id: tripId
        }
    });
    await TripStatusModel.create({
        status: status,
        trip_id: tripId
    });
};


export const handleTripRefundEvents = async (hookType: ChargeHookType, paymentIntent: string, amount: number) => {
    const trip = await TripsModel.findOne({where: {payment_intent: paymentIntent}});
    if(!trip) return `No trip found for paymentIntent id : ${paymentIntent}`;
    switch (hookType) {
        case "charge.refunded":
            return await handleTripRefundSuccess(amount, trip.id);
        default:
            await handleTripRefundFailed(trip.id);
            return `Hook ${hookType} not handled for trips`;
    }
};


export const handleTripRefundSuccess = async (amount: number, tripId: number) => {
    await TripsModel.update({
        refund_amount: amount
    }, {
        where: {
            id: tripId
        }
    });

    await TripStatusModel.create({
        trip_id: tripId,
        status: "REFUND_SUCCEEDED"
    });

    return `Trip id ${tripId} refund succeeded`;
};

export const handleTripRefundFailed = async (tripId: number) => {
    await TripStatusModel.create({
        trip_id: tripId,
        status: "REFUND_FAILED"
    });
    return `Trip id ${tripId} refund failed`;
};
