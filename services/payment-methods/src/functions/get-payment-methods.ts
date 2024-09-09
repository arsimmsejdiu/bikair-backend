import { getPaymentMethods } from "../services/GetPaymentMethods";
import { GetPaymentMethodsInput,GetPaymentMethodsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetPaymentMethodsInput, GetPaymentMethodsOutput>(async request => {
    const userId = request.userId;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getPaymentMethods(userId, locale);
});
