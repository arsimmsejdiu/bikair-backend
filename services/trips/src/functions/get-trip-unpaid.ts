import { getUnpaidTrip } from "../services/getUnpaidTrip";
import { GetTripUnpaidInput,GetTripUnpaidOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripUnpaidInput, GetTripUnpaidOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await getUnpaidTrip(userId);
});
