import {getTripStatusHistory} from "../services/getTripStatusHistory";
import {HandlerWithTokenAuthorizerBuilder,TripStatus} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<undefined, TripStatus[]>(async request => {
    const id = Number(request.pathParams?.id) ?? null;
    if (!id) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }
    return await getTripStatusHistory(id);
});
