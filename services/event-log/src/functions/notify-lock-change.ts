import notifyLockChange from "../services/notifyLockChange";
import { HandlerWithTokenAuthorizerBuilder, PostNotifyLockChangeInput,PostNotifyLockChangeOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostNotifyLockChangeInput, PostNotifyLockChangeOutput>(async request => {
    const body = request.body;
    const userId = request.userId;

    if (!body || Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await notifyLockChange(userId, body);
});
