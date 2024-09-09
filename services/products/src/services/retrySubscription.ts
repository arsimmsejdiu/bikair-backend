import { retrySubscriptionPayment } from "./retrySubscriptionPayment";
import { PaymentMethodsModel,PostSubscriptionRetryInput, ProductsModel, UsersModel, UserSubscriptionsModel } from "@bikairproject/lib-manager";

export const retrySubscription = async (userId: number, body: PostSubscriptionRetryInput, locale: string) => {
    try {
        const user = await UsersModel.findByPk(userId);
        if (!user) {
            return {
                statusCode: 404,
                result: "NO_USER_FOUND"
            };
        }

        const payment_method = await PaymentMethodsModel.findOne({
            where: {
                user_id: user.id,
                status: "ACTIVE"
            }
        });
        if (!payment_method) {
            return {
                statusCode: 404,
                result: "MISSING_PM"
            };
        }

        const userSubscription = await UserSubscriptionsModel.findByPk(body.subscription_id);
        if (!userSubscription) {
            return {
                statusCode: 404,
                result: "NO_SUBSCRIPTION_FOUND"
            };
        }

        const product = await ProductsModel.findByPk(userSubscription.product_id);
        if (!product?.recurring || !userSubscription.provider_subscription_id) {
            return {
                statusCode: 400,
                result: "WRONG_PRODUCT_ACTION"
            };
        }

        return await retrySubscriptionPayment(userSubscription.provider_subscription_id, payment_method.card_token);
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
