import {getBikeDetail} from "../services/getBikeDetail";
import {GetBikeDetailInput, GetBikeDetailOutput, HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikeDetailInput, GetBikeDetailOutput>(async request => {
    const bikeId = Number(request.event.pathParameters?.bike_id);

    if (Number.isNaN(bikeId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikeDetail(bikeId);
});
