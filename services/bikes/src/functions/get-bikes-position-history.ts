import {getBikesPositionHistory} from "../services/getBikesPositionHistory";
import {GetBikesPositionHistoryInput, GetBikesPositionHistoryOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikesPositionHistoryInput, GetBikesPositionHistoryOutput>(async request => {
    const bikeId = Number(request.event.pathParameters?.bike_id);

    if (Number.isNaN(bikeId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikesPositionHistory(bikeId);
});
