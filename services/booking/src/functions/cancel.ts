import {cancel} from "../services/cancel";
import {DeleteCancelBookingInput, DeleteCancelBookingOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<DeleteCancelBookingInput, DeleteCancelBookingOutput>(async request => {
    const userId = request.userId;
    const origin = request.origin;

    if (Number.isNaN(userId) || !origin) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await cancel(userId, origin);
});
