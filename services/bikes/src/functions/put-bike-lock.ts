import {updateBikeLock} from "../services/updateBikeLock";
import {HandlerWithTokenAuthorizerBuilder, PutBikeLockInput, PutBikeLockOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutBikeLockInput, PutBikeLockOutput>(async request => {
    const body = request.body;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateBikeLock(body);
});
