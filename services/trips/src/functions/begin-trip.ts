import { beginTrip } from "../services/beginTrip-v2";
import { HandlerWithTokenAuthorizerBuilder, PostBeginTripInput,PostBeginTripOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostBeginTripInput, PostBeginTripOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;
    const origin = request.origin;
    if (Number.isNaN(userId) || !body || !origin) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }
    return await beginTrip(userId, body, locale, origin);
});
