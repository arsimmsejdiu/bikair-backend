import {updateBikes} from "../services/updateBikes";
import {HandlerWithTokenAuthorizerBuilder, PutBikesInput, PutBikesOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutBikesInput, PutBikesOutput>(async request => {
    const origin = request.origin;
    const userId = request.userId;
    const body = request.body;

    if (Number.isNaN(userId) || !body || !origin) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateBikes(userId, origin, body);
});
