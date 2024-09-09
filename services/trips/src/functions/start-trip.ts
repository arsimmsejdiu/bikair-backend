import { startTrip } from "../services/startTrip";
import { HandlerWithTokenAuthorizerBuilder,  PutStartTripInput,PutStartTripOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutStartTripInput, PutStartTripOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;

    if (Number.isNaN(userId) || !body) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }

    return await startTrip(userId, body, locale);
});
