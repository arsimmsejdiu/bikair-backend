import {UserNotificationsModel} from "@bikairproject/lib-manager";


export const GetUserNotificationById = async (userId: number, notificationId: number) => {
    try {
        const userNotification = await UserNotificationsModel.findOne({
            where: {
                user_id: userId,
                uuid: notificationId
            }
        });

        if (userNotification === null) {
            return {
                statusCode: 404,
                result: "No notification found"
            };
        }

        return {
            statusCode: 200,
            result: userNotification
        };
    } catch (err) {
        console.log("[ERROR]", err);
        return {
            statusCode: 400,
            result: err
        };
    }
};
