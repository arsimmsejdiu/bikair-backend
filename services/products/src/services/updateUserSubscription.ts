import {PutUserSubscriptionInput,UserSubscriptionsModel, UserSubscriptionsUpdate} from "@bikairproject/lib-manager";

export const updateUserSubscription = async (subscriptionId: number, body: PutUserSubscriptionInput | undefined, locale: string) => {
    try {
        if (typeof body === "undefined") {
            return {
                statusCode: 200,
                result: {}
            };
        }

        const userSubData: UserSubscriptionsUpdate = {id: subscriptionId};

        if (typeof body?.status !== "undefined" &&  body?.status !== null) {
            userSubData.status = body.status;
        }
        if (typeof body?.total_usage !== "undefined" &&  body?.total_usage !== null) {
            userSubData.total_usage = body.total_usage;
        }
        if (typeof body?.canceled_note !== "undefined" &&  body?.canceled_note !== null) {
            userSubData.canceled_note = body.canceled_note;
        }

        await UserSubscriptionsModel.update(userSubData, {
            where: {
                id: userSubData.id
            }
        });

        return {
            statusCode: 200,
            result: body
        };
    } catch (error) {
        console.log("[ERROR] userId : ", subscriptionId);
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
