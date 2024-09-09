import notifyLockPause from "../services/notifyLockPause";
import { HandlerWithTokenAuthorizerBuilder, PostNotifyLockChangeInput,PostNotifyLockChangeOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostNotifyLockChangeInput, PostNotifyLockChangeOutput>(async request => {
    const userId = request.userId;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    
    return await notifyLockPause(userId, locale);
});
