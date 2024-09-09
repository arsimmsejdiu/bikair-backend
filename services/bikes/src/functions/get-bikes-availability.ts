import {getBikesAvailability} from "../services/getBikesAvailability";
import {GetBikesAvailabilityInput, GetBikesAvailabilityOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikesAvailabilityInput, GetBikesAvailabilityOutput>(async request => {
    const locale = request.locale;
    const origin = request.origin;
    const userId = request.userId;
    const bikeName = request.event.pathParameters?.bikeName;

    if (Number.isNaN(userId) || !bikeName || !origin) {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikesAvailability(locale, userId, bikeName.trim().toUpperCase(), origin);
});
