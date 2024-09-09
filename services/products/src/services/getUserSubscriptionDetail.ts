import {GetSubscriptionDetailOutput, ProductsModel,ProductVariationsModel,UsersModel, UserSubscriptionsModel} from "@bikairproject/lib-manager";

export const getUserSubscriptionDetail = async (id: number) => {
    try {
        const userSubscription = await UserSubscriptionsModel.findByPk(id);

        if (!userSubscription) {
            return {
                statusCode: 404,
                result: "Not found"
            };
        }

        const user = await UsersModel.findByPk(userSubscription.user_id);
        const product = await ProductsModel.findByPk(userSubscription.product_id);
        const productVariation = await ProductVariationsModel.findByPk(userSubscription.product_variation_id);

        if(!user) {
            return {
                statusCode: 500,
                result: "User not found for subscription"
            };
        }

        const result: GetSubscriptionDetailOutput = {...userSubscription};
        result.user_id = user.id;
        result.user_name = user.firstname + " " + user.lastname;
        result.product_name = product?.name;
        result.product_variation = productVariation || null;

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] Subscription Detail id : ", id);
        throw error;
    }
};
