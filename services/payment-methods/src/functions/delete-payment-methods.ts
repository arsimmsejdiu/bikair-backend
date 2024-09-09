import { deletePaymentMethods } from "../services/DeletePaymentMethods";
import { DeletePaymentMethodsInput,DeletePaymentMethodsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<DeletePaymentMethodsInput, DeletePaymentMethodsOutput>(async request => {
    const userId = request.userId;
    const uuid = request.event.pathParameters?.uuid;

    if (Number.isNaN(userId) || !uuid) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await deletePaymentMethods(uuid, userId);
});
