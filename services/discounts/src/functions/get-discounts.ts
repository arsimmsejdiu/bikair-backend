import getDiscounts from "../services/getDiscounts";
import {GetDiscountsInput, GetDiscountsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetDiscountsInput, GetDiscountsOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getDiscounts(query);
});
