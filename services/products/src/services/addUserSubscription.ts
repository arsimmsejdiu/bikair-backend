import {STRIPE_SECRET_KEY, STRIPE_TAX_RATES} from "../config/config";
import {ProductsInput} from "../model/ProductInput";
import {retrySubscriptionPayment} from "./retrySubscriptionPayment";
import {
    generateReferenceTrip,
    GetUserDiscountForProduct,
    PaymentMethodsModel,
    ProductsModel,
    SUBSCRIPTION_STATUS,
    UserDiscountsModel,
    UsersModel,
    UserSubscriptionsModel
} from "@bikairproject/lib-manager";
import {StripeApi} from "@bikairproject/stripe-api";

export const addUserSubscription = async (city_id: number, user: UsersModel, product: ProductsInput, payment_method: PaymentMethodsModel, locale: string) => {
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" ||
            typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }

        console.log("addUserSubscription with variation ? ", !!product.product_variation);
        if (!user.stripe_customer || !product.price_id) {
            return {
                statusCode: 404,
                result: "MISSING_STRIPE_ID"
            };
        }
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        const subscriptionProducts = await ProductsModel.findAll({
            where: {
                recurring: true
            }
        });

        const subscriptionProductIds = subscriptionProducts.map(s => s.id);

        const userSubscriptionActive = await UserSubscriptionsModel.findOne({
            where: {
                user_id: user.id,
                status: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.UNPAID, SUBSCRIPTION_STATUS.CANCELED],
                product_id: subscriptionProductIds
            }
        });

        if (userSubscriptionActive !== null) {
            return {
                statusCode: 400,
                result: "ALREADY_SUBSCRIBED"
            };
        }

        const unstardedUserSubscription = await UserSubscriptionsModel.findAll({
            where: {
                user_id: user.id,
                status: [SUBSCRIPTION_STATUS.ON_HOLD, SUBSCRIPTION_STATUS.INCOMPLETE],
                product_id: subscriptionProductIds
            }
        });

        for (const sub of unstardedUserSubscription) {
            if (sub.provider_subscription_id) {
                await stripeApi.cancelSubscription(sub.provider_subscription_id);
            }
            await UserSubscriptionsModel.destroy({
                where: {
                    id: sub.id
                }
            });
        }

        const userDiscount = await GetUserDiscountForProduct(user.id, product.id);

        console.log(userDiscount);
        let promoCodeIdMaybe: string | undefined = undefined;
        if(userDiscount){
            const promotionCode = await stripeApi.retrievePromotionCode(userDiscount?.code);
            if(promotionCode.data && promotionCode.data.length > 0){
                promoCodeIdMaybe = promotionCode.data[0].id;
            }
        }
        const subscription = await stripeApi.createSubscription(user.stripe_customer, product.price_id, payment_method.card_token, generateReferenceTrip(), "DESC_PAYMENT_SUBSCRIPTION", promoCodeIdMaybe);
        const nextBillingDate = new Date(subscription.current_period_end * 1000);

        console.log("subscription.status = ", subscription?.status);
        console.log("nextBillingDate = ", nextBillingDate);

        if(userDiscount){
            await UserDiscountsModel.update({
                status: "CLOSED",
                used: true,
                invoice_reference: subscription.id
            }, {
                where: {
                    id: userDiscount.id
                }
            });
        }

        const userSubscription = await UserSubscriptionsModel.create({
            user_id: user.id,
            payment_method_id: payment_method.id,
            provider_subscription_id: subscription.id,
            product_id: product.id,
            city_id: city_id,
            next_billing_date: nextBillingDate.toDateString(),
            status: SUBSCRIPTION_STATUS.INCOMPLETE,
            recurring: product.recurring,
            max_usage: product.max_usage,
            name: product.name,
            price: product.price,
            discount_id: product.discount_id,
            discount_type: product.discount_type,
            discount_value: product.discount_value,
            product_variation_id: product.product_variation?.id
        });

        if (subscription.status === "active") {
            console.log("Subscription is already paid. Update UserSubscription to ACTIVE");
            await UserSubscriptionsModel.update({
                status: SUBSCRIPTION_STATUS.ACTIVE
            }, {
                where: {
                    id: userSubscription.id
                }
            });

            return {
                statusCode: 204
            };
        } else {
            console.log("Subscription is not paid. Making a retry of paying the invoice to get returnUrl");
            return await retrySubscriptionPayment(subscription.id, payment_method.card_token);
        }
    } catch (error) {
        console.log("[ERROR] city_id : ", city_id);
        console.log("[ERROR] user : ", user);
        console.log("[ERROR] product : ", product);
        console.log("[ERROR] payment_method : ", payment_method);
        throw error;
    }
};
