import { deleteSpots } from "../services/deleteSpots";
import { DeleteSpotsInput, DeleteSpotsOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<DeleteSpotsInput, DeleteSpotsOutput>(async request => {
    const spotId = Number(request.event.pathParameters?.spot_id);

    if (Number.isNaN(spotId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await deleteSpots(spotId);
});
