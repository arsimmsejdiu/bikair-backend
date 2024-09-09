import {RETURN_URL_PASS, STRIPE_SECRET_KEY, STRIPE_TAX_RATES} from "../config/config";
import {ProductsInput} from "../model/ProductInput";
import {computePrice, DiscountInput} from "./computePrice";
import {
    ComputedPrice,
    generateReferenceTrip,
    GetUserDiscountForProduct,
    PaymentMethodsModel,
    PROVIDER_INVOICE_TYPE,
    SUBSCRIPTION_STATUS,
    UserDiscountsModel,
    UsersModel,
    UserSubscriptionsModel
} from "@bikairproject/lib-manager";
import {StripeApi} from "@bikairproject/stripe-api";

// Calculate discount values

// const validCodes = ["MILLEPREMIERE", "TEST1", "TEST2", "TEST3", "TEST4", "TEST5", "TEST6", "TEST7", "TEST8"];
//
// const calculateDiscountValues = (value: number, code: string | undefined) => {
//     console.log("Discount Value --> ", value);
//     console.log("Discount code --> ", code)
//     if (code && validCodes.includes(code)) {
//         switch (value) {
//             case 60:
//                 return value + 10;
//             case 120:
//                 return value + 20;
//             case 240:
//                 return value + 30;
//             default:
//                 return value;
//         }
//     } else {
//         return value;
//     }
// };

const calculateDiscountValues = (value: number, code: string | undefined) => {
    if (code !== "MILLEPREMIERE") {
        return value;
    } else if (code === "MILLEPREMIERE") {
        switch (value) {
            case 60:
                return value + 10;
            case 120:
                return value + 20;
            case 240:
                return value + 30;
            default:
                return value;
        }
    } else {
        return value;
    }
};

export const addUserPass = async (city_id: number, user: UsersModel, product: ProductsInput, payment_method: PaymentMethodsModel, locale: string) => {
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" ||
            typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }

        console.log("addUserPass with variation---------------- ? ", !!product.product_variation);

        if (!product) {
            return {
                statusCode: 404,
                result: "NO_PRODUCT_FOUND"
            };
        }

        if (!user.stripe_customer) {
            return {
                statusCode: 404,
                result: "MISSING_STRIPE_ID"
            };
        }

        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        const unStartedUserSubscription = await UserSubscriptionsModel.findAll({
            where: {
                user_id: user.id,
                status: [SUBSCRIPTION_STATUS.ON_HOLD, SUBSCRIPTION_STATUS.INCOMPLETE],
                product_id: product.id
            }
        });

        for (const sub of unStartedUserSubscription) {
            if (sub.provider_subscription_id) {
                await stripeApi.cancelInvoice(sub.provider_subscription_id);
            }
            await UserSubscriptionsModel.destroy({
                where: {
                    id: sub.id
                }
            });
        }

        const userDiscount = await GetUserDiscountForProduct(user.id, product.id);

        let discountInput: DiscountInput | null = null;
        if (userDiscount) {
            discountInput = {
                id: userDiscount.discount_id,
                code: userDiscount.code,
                type: userDiscount.type,
                value: userDiscount.value ?? 0
            };
        }

        const price: ComputedPrice = computePrice(discountInput, product.price);
        const invoice = await stripeApi.createInvoice(user.stripe_customer, price, PROVIDER_INVOICE_TYPE.PASS, generateReferenceTrip(), "DESC_PAYMENT_PASS");

        if (!invoice.id) {
            return {
                statusCode: 500,
                result: "Missing invoice id"
            };
        }

        //TODO créer un user discount a la place en fonction du type du produit.
        const userSubscription = await UserSubscriptionsModel.create({
            user_id: user.id,
            provider_subscription_id: invoice.id,
            payment_method_id: payment_method.id,
            product_id: product.id,
            city_id: city_id,
            status: SUBSCRIPTION_STATUS.INCOMPLETE,
            product_variation_id: product.product_variation?.id,
            recurring: product.recurring,
            max_usage: product.max_usage,
            name: product.name,
            price: product.price,
            discount_id: product.discount_id,
            discount_type: product.discount_type,
            discount_value: calculateDiscountValues(product.discount_value, userDiscount?.code),
        });

        let paymentIntent: any;
        let pi: string | undefined;
        try {
            if (typeof invoice.payment_intent === "string") {
                pi = invoice.payment_intent;
            } else {
                pi = invoice.payment_intent?.id;
            }

            if (!pi) {
                return {
                    statusCode: 500,
                    result: "No Payment Intent for invoice"
                };
            }

            paymentIntent = await stripeApi.confirmPayment(pi, payment_method.card_token, RETURN_URL_PASS, (user.email ?? "").trim());
        } catch (error) {
            await UserSubscriptionsModel.destroy({
                where: {
                    id: userSubscription.id
                }
            });

            return {
                statusCode: 402,
                result: "stripe-error"
            };
        }
        console.log(`Payment intent status : ${paymentIntent.status}`);
        const pStatus = paymentIntent.status ? paymentIntent.status.toLowerCase() : "other";

        if (userDiscount) {
            await UserDiscountsModel.update({
                status: "CLOSED",
                used: true,
                invoice_reference: pi
            }, {
                where: {
                    id: userDiscount.id
                }
            });
        }


        if (pStatus === "requires_action") {
            const redirectUrl = paymentIntent.next_action?.redirect_to_url?.url ?? null;
            await UserSubscriptionsModel.update({
                status: SUBSCRIPTION_STATUS.ON_HOLD
            }, {
                where: {
                    id: userSubscription.id
                }
            });
            return {
                statusCode: 200,
                result: {
                    redirectUrl: redirectUrl,
                    client_secret: paymentIntent.client_secret,
                    status: pStatus
                }
            };
        } else {
            return {
                statusCode: 204
            };
        }
    } catch (error) {
        console.log("[ERROR] city_id : ", city_id);
        console.log("[ERROR] user : ", user);
        console.log("[ERROR] product : ", product);
        console.log("[ERROR] payment_method : ", payment_method);
        throw error;
    }
};
