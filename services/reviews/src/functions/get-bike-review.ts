import { getReview } from "../services/getReview";
import { GetBikeReviewInput,GetBikeReviewOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikeReviewInput, GetBikeReviewOutput>(async request => {
    const bikeId = Number(request.event.pathParameters?.bike_id);

    if (Number.isNaN(bikeId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getReview(bikeId);
});
