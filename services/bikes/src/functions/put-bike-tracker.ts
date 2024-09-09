import {updateBikeTracker} from "../services/updateBikeTracker";
import {HandlerWithTokenAuthorizerBuilder, PutBikeTrackerInput, PutBikeTrackerOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutBikeTrackerInput, PutBikeTrackerOutput>(async request => {
    const body = request.body;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateBikeTracker(body);
});
