import express from "express";
import { Stripe } from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { ChargeHookType } from "../models/ChargeHookType";
import { InvoiceHookType } from "../models/InvoiceHookType";
import { PaymentIntentHookType } from "../models/PaymentIntentHookType";
import { PaymentMethodHookType } from "../models/PaymentMethodHookType";
import { SetupIntentHookType } from "../models/SetupIntentHookType";
import { SubscriptionHookType } from "../models/SubscriptionHookType";
import * as dashboardReportService from "../service/dashboardReportService";
import { handleDepositPaymentIntentEvent } from "../service/depositService";
import { sendSlackAlert, sendSlackError } from "../service/notificationService";
import { handlePassInvoiceEvents } from "../service/passService";
import { handlePaymentLink } from "../service/paymentLink";
import { handlePaymentMethodEvents } from "../service/paymentMethodService";
import { handleSetupIntentEvents } from "../service/setupIntentService";
import {
    handleSubscriptionCancelEvent,
    handleSubscriptionInvoiceEvents,
    handleSubscriptionUpdateEvent
} from "../service/subscriptionService";
import { handleTripInvoiceEvents, handleTripRefundEvents } from "../service/tripService";
import { BikesModel, DashboardReportModel, getSequelize, TripDepositsModel, TripsModel, TripStatusModel, UsersModel, UserSubscriptionsModel } from "@bikairproject/database";
import { mailPaidTrip } from "@bikairproject/mailing";
import {PROVIDER_INVOICE_TYPE, Users} from "@bikairproject/shared";
import { StripeApi } from "@bikairproject/stripe-api";
import { DateUtils } from "@bikairproject/utils";

const router = express.Router();

router.post("/subscription-update", async (req, res) => {
    try {
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.id) {
            return res.status(200).send("Format invalide").end();
        }
        const hookType = String(req.body.type) as SubscriptionHookType;
        const subscription = req.body.data.object as Stripe.Subscription;

        let result = "Ok";
        switch (hookType) {
            case "customer.subscription.deleted":
                result = await handleSubscriptionCancelEvent(subscription);
                break;
            case "customer.subscription.updated":
                result = await handleSubscriptionUpdateEvent(subscription);
                break;
            default:
                console.log(`Event ${hookType} is not handled (${subscription?.id})`);
                return res.status(200).send(`Event ${hookType} is not handled (${subscription?.id})`).end();
        }

        return res.send(result).end();
    } catch (err) {
        console.log(err);
        await sendSlackError(req, err);
        return res.status(200).send(err).end();
    }
});

router.post("/invoice-update", async (req, res) => {
    try {
        let result;
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.id) {
            return res.status(200).send("Format invalide").end();
        }
        const hookType = String(req.body.type) as InvoiceHookType;
        const invoice = req.body.data.object as Stripe.Invoice;
        const type: PROVIDER_INVOICE_TYPE | undefined = PROVIDER_INVOICE_TYPE[invoice.metadata?.type ?? ""];

        // When invoice is a subscription
        if (invoice.subscription) {
            result = await handleSubscriptionInvoiceEvents(hookType, invoice);
            return res.status(200).send(result).end();
        }

        if (!type) {
            console.log(`Cannot identify invoice ${invoice?.id} for type ${invoice.metadata?.type}`);
            return res.status(200).send(`Cannot identify invoice ${invoice?.id} for type ${invoice.metadata?.type}`).end();
        }

        //TODO géré le cas du type = DSCOUNT et créer un service handleDiscountInvoiceEvents
        switch (type) {
            case PROVIDER_INVOICE_TYPE.TRIP_PAYMENT:
                result = await handleTripInvoiceEvents(hookType, invoice);
                break;
            case PROVIDER_INVOICE_TYPE.PASS:
                result = await handlePassInvoiceEvents(hookType, invoice);
                break;
            case PROVIDER_INVOICE_TYPE.DEPOSIT:
                return res.status(200).send("Type DEPOSIT is not handled here").end();
            default:
                await sendSlackAlert(req, `Type ${type} is not handled (${invoice?.id})`);
                return res.status(200).send("Type is not handled").end();
        }

        return res.send(result).end();
    } catch (err) {
        console.log(err);
        await sendSlackError(req, err);
        return res.status(200).send(err).end();
    }
});

/** @description Update trip deposit status  */
router.post("/checkout-update", async (req, res) => {
    try {
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.id) {
            return res.status(200).send("Format invalide").end();
        }
        if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
            return res.status(500).send("Missing stripe key env value").end();
        }

        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);
        const checkoutSession = await stripeApi.retrieveCheckoutSession(req.body.data.object.id);
        const {email, name, phone} = req.body.data.object.customer_details;
        await handlePaymentLink(email, name, phone, checkoutSession);
    }catch(error){
        await sendSlackError(req, error);
        return res.status(200).send(error).end();
    }
});


/** @description Update trip deposit status  */
router.post("/payment-intent-update", async (req, res) => {
    try {
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.id) {
            return res.status(200).send("Format invalide").end();
        }

        const hookType = String(req.body.type) as PaymentIntentHookType;
        const paymentIntent = req.body.data.object as Stripe.PaymentIntent;

        const type: PROVIDER_INVOICE_TYPE | undefined = PROVIDER_INVOICE_TYPE[paymentIntent.metadata?.type ?? ""];

        if (!type) {
            console.log(`Cannot identify paymentIntent ${paymentIntent?.id} for type ${paymentIntent.metadata?.type}`);
            return res.status(200).send(`Cannot identify paymentIntent ${paymentIntent?.id} for type ${paymentIntent.metadata?.type}`).end();
        }

        let result = "Ok";
        switch (type) {
            case PROVIDER_INVOICE_TYPE.TRIP_PAYMENT:
                return res.status(200).send("Type TRIP_PAYMENT is not handled here").end();
            case PROVIDER_INVOICE_TYPE.DEPOSIT:
                result = await handleDepositPaymentIntentEvent(hookType, paymentIntent);
                break;
            case PROVIDER_INVOICE_TYPE.SUBSCRIPTION:
                return res.status(200).send("Type SUBSCRIPTION is not handled here").end();
            case PROVIDER_INVOICE_TYPE.PASS:
                return res.status(200).send("Type PASS is not handled here").end();
            case PROVIDER_INVOICE_TYPE.DISCOUNT:
                return res.status(200).send("Type DISCOUNT is not handled here").end();
            default:
                await sendSlackError(req, `Type ${type} is not handled (${paymentIntent?.id})`);
                return res.status(200).send("Type is not handled").end();
        }

        return res.send(result).end();
    } catch (err) {
        console.log(err);
        await sendSlackError(req, err);
        return res.status(200).send(err).end();
    }
});

/**
 * Catch event on payment-methods
 */
router.post("/payment-methods-update", async (req, res, next) => {
    try {
        if (!req.body?.data?.object) {
            return res.status(200).send("Format invalide").end();
        }
        const hookType = String(req.body.type) as PaymentMethodHookType;
        const paymentMethod = req.body.data.object as Stripe.PaymentMethod;

        const result = await handlePaymentMethodEvents(hookType, paymentMethod);

        return res.send(result).end();
    } catch (err) {
        console.log(err);
        await sendSlackError(req, err);
        return res.status(200).send(err).end();
    }
});

/**
 * Catch event on payment-methods
 */
router.post("/setup-intent-update", async (req, res, next) => {
    try {
        if (!req.body?.data?.object) {
            return res.status(200).send("Format invalide").end();
        }
        const hookType = String(req.body.type) as SetupIntentHookType;
        const setupIntent = req.body.data.object as Stripe.SetupIntent;

        const result = await handleSetupIntentEvents(hookType, setupIntent);

        return res.send(result).end();
    } catch (err) {
        console.log(err);
        await sendSlackError(req, err);
        return res.status(200).send(err).end();
    }
});

/**
 * Send an email to admin on payment_intent.succeeded (Stripe webhook)
 */
router.post("/payment-status", async (req, res, next) => {
    try {
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.id) {
            return res.status(200).send("Format invalide").end();
        }
        // Get trip infos
        const trip = await TripsModel.findOne({
            where: {
                payment_intent: req.body.data.object.id
            }
        });
        if (!trip) {
            return res.status(200).send("No trip found").end();
        }

        let tripStatus = "PAYMENT_SUCCESS";
        const user = await UsersModel.findByPk(trip.user_id);
        // Email admin
        const bike = await BikesModel.findByPk(trip.bike_id);
        if(trip.user_subscription_id){
            const us = await UserSubscriptionsModel.findByPk(trip.user_subscription_id);
            tripStatus = us?.recurring ? "SUBSCRIPTION" : "PASS";
        }
        if(trip.discount_id){
            tripStatus =  "DISCOUNTED";
        }

        // Update status
        await TripsModel.update({
            status: tripStatus
        }, {
            where: {
                id: trip.id
            }
        });
        await TripStatusModel.create({
            status: "PAYMENT_SUCCESS",
            trip_id: trip.id
        });
        if(tripStatus !== "PAYMENT_SUCCESS"){
            await TripStatusModel.create({
                status: tripStatus,
                trip_id: trip.id
            });
        }

        await mailPaidTrip(user, bike, trip, "PAYMENT_SUCCESS");
        return res.send("ok").end();
    } catch (err) {
        console.log(err);
        next(err);
    }
});

/** @description Update trip deposit status  */
router.post("/deposit-status", async (req, res, next) => {
    try {
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.id) {
            return res.status(200).send("Format invalide").end();
        }
        // Ensure this is a deposit
        if (req.body.data.object.metadata && req.body.data.object.metadata.type !== "DEPOSIT") {
            return res.status(200).send("This is not a deposit!").end();
        }
        let status = "UNKNOWN";
        switch (req.body.type) {
            case "payment_intent.canceled":
                status = "INACTIVE";
                break;
            case "payment_intent.amount_capturable_updated":
            // Ensure you render inactive all deposit before processing
            // eslint-disable-next-line no-case-declarations
                const cusId = req.body.data.object.charges.data[0].customer;
                if (!cusId) return res.status(200).send("No cusId found !").end();
                // eslint-disable-next-line no-case-declarations
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
                    return res.status(200).send(`No user found for ${cusId}`).end();
                }
                status = "ACTIVE";
                break;
            case "payment_intent.succeeded":
                if (req.body.data.object.amount_capturable === 0) {
                    status = "CAPTURED";
                }
                break;
            case "payment_intent.payment_failed":
                status = "FAILED";
                break;
            case "payment_intent.requires_action":
                status = "ON_HOLD";
                break;
            default:
                break;
        }

        const [affectedCount] = await TripDepositsModel.update({
            status: status
        }, {
            where: {
                payment_intent: req.body.data.object.id
            }
        });
        if (affectedCount === 0) {
            return res.status(200).send("No trip deposit found").end();
        }
        return res.send("ok").end();
    } catch (err) {
        console.log("/deposit-status", err);
        next(err);
    }
});


/**
 * Send an email to admin on payment_intent.failed (Stripe webhook)
 */
router.post("/payment-failed", async (req, res, next) => {
    try {
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.id) {
            return res.status(200).send("Format invalide").end();
        }
        // Get trip infos
        const trip = await TripsModel.findOne({
            where: {
                payment_intent: req.body.data.object.id
            }
        });
        if (!trip) {
            return res.status(200).send("No trip found").end();
        }

        // Ensure status is not already successed
        if (trip.status === "PAYMENT_SUCCESS") {
            return res.send("OK").end();
        }

        // Update status
        await TripsModel.update({
            status: "PAYMENT_FAILED"
        }, {
            where: {
                id: trip.id
            }
        });
        await TripStatusModel.create({
            status: "PAYMENT_FAILED",
            trip_id: trip.id
        });

        // Send alert email
        const bike = await BikesModel.findByPk(trip.bike_id);
        const user = await UsersModel.findByPk(trip.user_id);

        await mailPaidTrip(user, bike, trip, "PAYMENT_FAILED");

        return res.send("ok").end();
    } catch (err) {
        next(err);
    }
});


/**
 * Update database when deposit expire, is canceled or is captured
 */
router.post("/report-ready", async (req, res, next) => {
    const transaction = await getSequelize().transaction();
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" || typeof STRIPE_TAX_RATES === "undefined") {
            return res.status(500).send("Missing stripe key env value").end();
        }

        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);
        let dashboardReport: DashboardReportModel | null = null;
        let message: string | null = null;
        let csvString: string | null = null;

        switch (req.body.type) {
            case "reporting.report_run.succeeded":
                if (!req.body?.data?.object?.parameters?.interval_start ||
                !req.body?.data?.object?.parameters?.interval_end) {
                    await transaction.commit();
                    return res.status(200).send("Format invalide").end();
                }
                // eslint-disable-next-line no-case-declarations
                const interval_start = DateUtils.dateFormatDay(new Date(req.body.data.object.parameters.interval_start * 1000));
                // eslint-disable-next-line no-case-declarations
                const interval_end = DateUtils.dateFormatDay(new Date(req.body.data.object.parameters.interval_end * 1000));

                dashboardReport = await dashboardReportService.getOrCreateDashboardReport(interval_start, interval_end, transaction);
                await dashboardReportService.updateReportUrl(dashboardReport.id, req.body.data.object.result.url, transaction);

                csvString = await stripeApi.getFile(req.body.data.object.result.url);

                message = await dashboardReportService.parseCsv(dashboardReport.id, csvString, transaction);

                await transaction.commit();
                return res.send(message).end();
            default:
                console.log(`Event ${req.body.type} is not handled.`);
                return res.send(`Event ${req.body.type} is not handled.`).end();
        }

    } catch (err) {
        await transaction.rollback();
        next(err);
    }
});


/**
 * Update refund trip
 */
router.post("/charge-updates", async (req, res, next) => {
    try{
        if (!req.body.data ||
            !req.body.data.object ||
            !req.body.data.object.payment_intent) {
            return res.status(200).send("Format invalide").end();
        }

        const hookType = String(req.body.type) as ChargeHookType;
        const result = await handleTripRefundEvents(
            hookType,
            req.body.data.object.payment_intent,
            req.body.data.object.amount_refunded
        );

        return res.status(200).send(result).end();
    }catch(err){
        next(err);
    }
});

export default router;
