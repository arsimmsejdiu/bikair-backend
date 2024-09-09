import createDiscounts from "../services/createDiscounts";
import {HandlerWithTokenAuthorizerBuilder,  PostDiscountsInput, PostDiscountsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostDiscountsInput, PostDiscountsOutput>(async request => {
    const body = request.body;
    const locale = request.locale;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createDiscounts(body, locale);
});
