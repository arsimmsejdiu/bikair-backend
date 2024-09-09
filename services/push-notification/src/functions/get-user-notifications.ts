import { GetUserNotifications } from "../dao/GetUserNotifications";
import { GetUserNotificationsInput,GetUserNotificationsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserNotificationsInput, GetUserNotificationsOutput>(async request => {
    const userId = request.userId;
    const origin = request.origin;

    if (Number.isNaN(userId) || !origin) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await GetUserNotifications(userId);
});
