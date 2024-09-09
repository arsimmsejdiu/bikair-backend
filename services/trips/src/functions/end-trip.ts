import { endTrip } from "../services/endTrip";
import { HandlerWithTokenAuthorizerBuilder, PutEndTripInput,PutEndTripOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutEndTripInput, PutEndTripOutput>(async request => {
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

    return await endTrip(userId, body, locale, origin);
});
