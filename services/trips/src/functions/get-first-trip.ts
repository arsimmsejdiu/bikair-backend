import { getFirstTrip } from "../services/getFirstTrip";
import { GetFirstTripInput,GetFirstTripOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetFirstTripInput, GetFirstTripOutput>(async request => {
    const userId = request.userId;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await getFirstTrip(userId, locale);
});
