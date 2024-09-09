import { postPaymentSheet } from "../services/PostPaymentSheet";
import { HandlerWithTokenAuthorizerBuilder, PostPaymentSheetInput,PostPaymentSheetOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostPaymentSheetInput, PostPaymentSheetOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await postPaymentSheet(userId);
});
