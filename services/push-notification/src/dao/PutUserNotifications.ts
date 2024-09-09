import { PutUserNotificationsInput,UserNotificationsModel} from "@bikairproject/lib-manager";


export const PutUserNotifications = async (id: string, userId: number, body: PutUserNotificationsInput) => {
    try {
        await UserNotificationsModel.update(
            body,
            {
                where: {
                    id: id,
                    user_id: userId
                }
            });

        return {
            statusCode: 204,
            result: null
        };
    } catch (err) {
        console.log("[ERROR]--", err);
        return {
            statusCode: 400,
            result: err
        };
    }
};
