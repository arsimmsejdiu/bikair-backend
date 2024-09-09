import { postPaymentMethodsRegister } from "../services/PostPaymentMethodsRegister";
import { HandlerWithTokenAuthorizerBuilder, PostPaymentMethodsRegisterInput,PostPaymentMethodsRegisterOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostPaymentMethodsRegisterInput, PostPaymentMethodsRegisterOutput>(async request => {
    const body = request.body;
    const userId = request.userId;

    if (!body || Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await postPaymentMethodsRegister(body, userId);
});
