import {GetUserNotificationById} from "../dao/GetUserNotificationById";
import {GetUserNotificationsInput,GetUserNotificationsOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserNotificationsInput, GetUserNotificationsOutput>(async request => {
    const userId = request.userId;
    const origin = request.origin;
    const notificationId = Number(request.pathParams?.notificationId);

    if (Number.isNaN(userId) || Number.isNaN(notificationId) || !origin) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await GetUserNotificationById(userId, notificationId);
});
