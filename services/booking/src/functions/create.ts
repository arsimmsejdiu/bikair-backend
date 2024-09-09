import {create} from "../services/create";
import {HandlerWithTokenAuthorizerBuilder, PostCreateBookingInput, PostCreateBookingOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostCreateBookingInput, PostCreateBookingOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;
    const origin = request.origin;

    if (Number.isNaN(userId) || !body || !origin) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await create(body, locale, userId, origin);
});
