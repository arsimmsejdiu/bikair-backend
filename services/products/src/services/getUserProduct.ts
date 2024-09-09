import {findUserSubscriptions, UsersModel,UserSubscriptionDetail } from "@bikairproject/lib-manager";

export const getUserProduct = async (userId: number, locale: string) => {
    try {
        const user = await UsersModel.findByPk(userId);
        if (!user) {
            return {
                statusCode: 404,
                result: "NO_USER_FOUND"
            };
        }

        const subscriptions: UserSubscriptionDetail[] = await findUserSubscriptions(user.id);

        console.log(subscriptions);

        return {
            statusCode: 200,
            result: subscriptions
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
