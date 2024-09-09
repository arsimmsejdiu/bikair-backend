import { retrievePayment } from "../services/retrievePayment";
import { GetRetrievePaymentInput,GetRetrievePaymentOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetRetrievePaymentInput, GetRetrievePaymentOutput>(async request => {
    const userId = request.userId;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await retrievePayment(userId, locale);
});
