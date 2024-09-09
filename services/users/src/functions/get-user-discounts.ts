import { getDiscounts } from "../services/getDiscounts";
import { GetUserDiscountsInput,GetUserDiscountsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserDiscountsInput, GetUserDiscountsOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getDiscounts(userId);
});
