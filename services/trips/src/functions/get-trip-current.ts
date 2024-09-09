import { getCurrentTrip } from "../services/getCurrentTrip";
import { GetTripCurrentInput,GetTripCurrentOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripCurrentInput, GetTripCurrentOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await getCurrentTrip(userId);
});
