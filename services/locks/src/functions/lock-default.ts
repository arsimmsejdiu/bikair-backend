import notifyLockDefault from "../services/notifyLockDefault";
import { HandlerWithTokenAuthorizerBuilder, PostLockDefaultInput,PostLockDefaultOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostLockDefaultInput, PostLockDefaultOutput>(async request => {
    const userId = request.userId;
    const lockError = request.event.pathParameters?.lock_error;

    if (Number.isNaN(userId) || !lockError) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await notifyLockDefault(userId, lockError);
});
