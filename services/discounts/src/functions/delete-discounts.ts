import deleteDiscounts from "../services/deleteDiscounts";
import { DeleteDiscountsInput, DeleteDiscountsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";


export const handler = HandlerWithTokenAuthorizerBuilder<DeleteDiscountsInput, DeleteDiscountsOutput>(async request => {
    const discountId = Number(request.event.pathParameters?.discount_id);

    if (Number.isNaN(discountId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await deleteDiscounts(discountId);
});
