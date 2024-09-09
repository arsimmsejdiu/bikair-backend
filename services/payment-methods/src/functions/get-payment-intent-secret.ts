import { getPaymentIntentSecret } from "../services/GetPaymentIntentSecret";
import { GetPaymentIntentSecretInput,GetPaymentIntentSecretOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetPaymentIntentSecretInput, GetPaymentIntentSecretOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getPaymentIntentSecret(userId);
});
