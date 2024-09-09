import { createDiscounts } from "../services/createDiscounts";
import { CreateUserDiscountInput,CreateUserDiscountOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<CreateUserDiscountInput, CreateUserDiscountOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createDiscounts(userId, body, locale);
});
