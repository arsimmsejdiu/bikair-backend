import { getProductsAvailable } from "../services/getProductsAvailable";
import { GetProductsAvailableInput,GetProductsAvailableOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetProductsAvailableInput, GetProductsAvailableOutput>(async request => {
    const userId = request.userId;
    const query = request.queryString;
    const origin = request.origin;

    if (Number.isNaN(userId) || !origin) {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await getProductsAvailable(userId, origin, query);
});
