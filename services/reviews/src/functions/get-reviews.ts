import { getReviews } from "../services/getReviews";
import { GetReviewsInput,GetReviewsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetReviewsInput, GetReviewsOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getReviews(query);
});
