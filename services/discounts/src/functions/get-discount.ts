import getDiscount from "../services/getDiscount";
import {GetDiscountInput, GetDiscountOutput, HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetDiscountInput, GetDiscountOutput>(async request => {
    const discountId = Number(request.event.pathParameters?.discount_id);

    if (Number.isNaN(discountId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getDiscount(discountId);
});
