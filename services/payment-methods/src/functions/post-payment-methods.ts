import { postPaymentMethods } from "../services/PostPaymentMethods";
import { HandlerWithTokenAuthorizerBuilder, PostPaymentMethodsInput,PostPaymentMethodsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostPaymentMethodsInput, PostPaymentMethodsOutput>(async request => {
    const body = request.body;
    const userId = request.userId;

    if (!body || Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await postPaymentMethods(body, userId);
});
