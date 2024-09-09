import { STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import {PaymentMethodsModel, PostPaymentMethodsInput, STATUS, TRIP_STATUS, TripsModel, UsersModel } from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

const stripeApi = new StripeApi(STRIPE_SECRET_KEY ?? "", STRIPE_TAX_RATES ?? "");

export const postPaymentMethods = async (body: PostPaymentMethodsInput, userId: number) => {
    try {
        const { paymentMethodId } = body;

        const user = await UsersModel.findByPk(userId);

        if (!user?.stripe_customer || !paymentMethodId) {
            return {
                statusCode: 404,
                result: "No User found"
            };
        }

        // Ensure you attach card to stripe customer before saving in ou DB in case of stripe rejection
        const newCard = await stripeApi.attachCardToCustomer(user.stripe_customer, paymentMethodId);

        // Ensure you disabled all previous card
        await PaymentMethodsModel.update({
            status: STATUS.INACTIVE
        }, {
            where: {
                user_id: userId
            }
        });

        const existingPM = await PaymentMethodsModel.findOne({
            where: {
                card_token: newCard.id
            }
        });

        if (existingPM) {
            await PaymentMethodsModel.update({
                status: STATUS.ACTIVE
            }, {
                where: {
                    card_token: newCard.id
                }
            });
        } else {
            await PaymentMethodsModel.create({
                card_token: newCard.id,
                brand: newCard.card?.brand,
                country: newCard.card?.country,
                user_id: userId,
                exp_year: newCard.card?.exp_year,
                exp_month: newCard.card?.exp_month,
                last_4: newCard.card?.last4 ? Number(newCard.card.last4) : null,
                status: STATUS.ACTIVE
            });
        }

        const paymentMethods = await PaymentMethodsModel.findOne({
            where: {
                card_token: newCard.id
            }
        });

        if (paymentMethods) {
            const trips = await TripsModel.findAll({
                where: {
                    user_id: userId,
                    status: [TRIP_STATUS.OPEN, TRIP_STATUS.CLOSED, TRIP_STATUS.WAIT_VALIDATION]
                }
            });
            for (let i = 0; i < trips.length; i++) {
                const element = trips[i];
                await TripsModel.update({
                    payment_method_id: paymentMethods.id
                }, {
                    where: {
                        user_id: userId,
                        id: element.id
                    }
                });
            }

            return {
                statusCode: 201,
                result: {
                    uuid: paymentMethods.uuid,
                    brand: paymentMethods.brand,
                    country: paymentMethods.country,
                    exp_month: paymentMethods.exp_month,
                    exp_year: paymentMethods.exp_year,
                    last_4: paymentMethods.last_4,
                    created_at: paymentMethods.created_at
                }
            };
        } else {
            return {
                statusCode: 400,
                result: null
            };
        }
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
