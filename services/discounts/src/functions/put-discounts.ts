import { updateDiscounts } from "../services/updateDiscounts";
import {HandlerWithTokenAuthorizerBuilder,  PutDiscountsInput, PutDiscountsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutDiscountsInput, PutDiscountsOutput>(async request => {
    const body = request.body;
    const locale = request.locale;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateDiscounts(body, locale);
});
