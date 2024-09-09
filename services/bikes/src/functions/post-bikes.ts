import {createBikes} from "../services/createBikes";
import {} from "@bikairproject/lambda-framework";
import {HandlerWithTokenAuthorizerBuilder, PostBikesInput, PostBikesOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostBikesInput, PostBikesOutput>(async request => {
    const origin = request.origin;
    const userId = request.userId;
    const body = request.body;

    if (Number.isNaN(userId) || !body || !origin) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createBikes(userId, origin, body);
});
