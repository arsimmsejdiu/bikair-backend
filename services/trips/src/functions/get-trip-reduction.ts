import {getTripReduction} from "../services/getTripReduction";
import {GetTripReductionInput,GetTripReductionOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripReductionInput, GetTripReductionOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await getTripReduction(userId);
});
