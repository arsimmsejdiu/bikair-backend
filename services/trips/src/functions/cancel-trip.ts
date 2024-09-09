import { cancelTrip } from "../services/cancelTrip";
import { HandlerWithTokenAuthorizerBuilder, PutCancelTripInput,PutCancelTripOutput } from "@bikairproject/lib-manager";


export const handler = HandlerWithTokenAuthorizerBuilder<PutCancelTripInput, PutCancelTripOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;

    if (Number.isNaN(userId) || !body) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }

    return await cancelTrip(userId, body, locale);
});
