import checkDeposit from "../services/checkDeposit";
import {GetCheckDepositInput, GetCheckDepositOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetCheckDepositInput, GetCheckDepositOutput>(async request => {
    const userId = request.userId;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await checkDeposit(userId, locale);
});
