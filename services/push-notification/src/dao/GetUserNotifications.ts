import { UserNotificationsModel } from "@bikairproject/lib-manager";


export const GetUserNotifications = async (userId: number) => {
    try {
        const userNotifications = await UserNotificationsModel.findAll({
            where: {
                user_id: userId
            },
            order: [
                ["updated_at", "ASC"]
            ]
        });

        return {
            statusCode: 200,
            result: userNotifications
        };
    } catch (err) {
        console.log("[ERROR]", err);
        return {
            statusCode: 400,
            result: err
        };
    }
};
