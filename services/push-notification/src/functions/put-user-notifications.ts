import { PutUserNotifications } from "../dao/PutUserNotifications";
import { HandlerWithTokenAuthorizerBuilder, PutUserNotificationsInput,PutUserNotificationsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutUserNotificationsInput, PutUserNotificationsOutput>(async request => {
    const id = request?.pathParams?.id ?? "";
    const userId = request.userId;
    const origin = request.origin;
    const body = request.body;

    if (Number.isNaN(id) || !origin || !body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await PutUserNotifications(id, userId, body);
});
