import {updateBikesPosition} from "../services/updateBikesPosition";
import {HandlerWithTokenAuthorizerBuilder, PutBikesPositionInput, PutBikesPositionOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutBikesPositionInput, PutBikesPositionOutput>(async request => {
    const bikeId = Number(request.event.pathParameters?.bike_id);
    const body = request.body;

    if (Number.isNaN(bikeId) || !body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateBikesPosition(bikeId, body);
});
