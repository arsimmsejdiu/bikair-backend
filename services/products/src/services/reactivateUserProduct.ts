import { reactivateUserSubscription } from "./reactivateUserSubscription";
import { findUserSubscription, PostReactivateProductsUserInput} from "@bikairproject/lib-manager";

export const reactivateUserProduct = async (body: PostReactivateProductsUserInput, locale: string) => {
    try {
        const userSubscription = await findUserSubscription(body.subscription_id);
        if (!userSubscription) {
            return {
                statusCode: 404,
                result: "NO_SUBSCRIPTION_FOUND"
            };
        }

        if (userSubscription.product_recurring) {
            return await reactivateUserSubscription(userSubscription, locale);
        } else {
            return {
                statusCode: 400,
                result: "You can't cancel a Pass"
            };
        }
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
