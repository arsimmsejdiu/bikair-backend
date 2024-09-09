import { getPaymentMethodsSecret } from "../services/GetPaymentMethodsSecret";
import { GetPaymentMethodsSecretInput,GetPaymentMethodsSecretOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetPaymentMethodsSecretInput, GetPaymentMethodsSecretOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getPaymentMethodsSecret(userId);
});
