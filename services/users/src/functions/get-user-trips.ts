import { getTrips } from "../services/getTrips";
import { GetUserTripsInput,GetUserTripsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserTripsInput, GetUserTripsOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getTrips(userId);
});
