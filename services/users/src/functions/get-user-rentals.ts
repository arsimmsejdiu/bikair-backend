import {getRentals} from "../services/getRentals";
import {GetUserRentalsInput,GetUserRentalsOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserRentalsInput, GetUserRentalsOutput>(async request => {
    const userId = request.userId;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getRentals(userId);
});
