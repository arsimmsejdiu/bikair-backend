import updateDepositStatus from "../services/updateDepositStatus";
import {HandlerWithTokenAuthorizerBuilder, PutDepositInput, PutDepositOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutDepositInput, PutDepositOutput>(async request => {
    const depositId = Number(request.event.pathParameters?.deposit_id);


    if (Number.isNaN(depositId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateDepositStatus(depositId);
});
