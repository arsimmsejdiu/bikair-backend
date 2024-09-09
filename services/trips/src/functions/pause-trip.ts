import { pauseTrip } from "../services/pauseTrip";
import { HandlerWithTokenAuthorizerBuilder,  PutPauseTripInput,PutPauseTripOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutPauseTripInput, PutPauseTripOutput>(async request => {
    const userId = request.userId;
    const body = request.body;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await pauseTrip(userId, body);
});
