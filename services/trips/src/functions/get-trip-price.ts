import { getTripPrice } from "../services/getTripPrice";
import { GetTripPriceInput,GetTripPriceOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripPriceInput, GetTripPriceOutput>(async request => {
    const userId = request.userId;
    const query = request.queryString;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await getTripPrice(userId, query);
});
