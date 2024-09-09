import { endTrip } from "../services/endTrip";
import { HandlerWithTokenAuthorizerBuilder, PutEndTripForceInput,PutEndTripForceOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutEndTripForceInput, PutEndTripForceOutput>(async request => {
    const body = request.body;
    const locale = request.locale;
    const origin = request.origin ?? "MOBILE_APP";

    if (!body?.userId) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }

    const userId = body.userId;

    return await endTrip(userId, body, locale, origin);
});
