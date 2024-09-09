import { postReview } from "../services/postReview";
import { HandlerWithTokenAuthorizerBuilder, PostReviewInput,PostReviewOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostReviewInput, PostReviewOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const origin = request.origin;

    if (Number.isNaN(userId) || !body || !origin) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await postReview(userId, body, origin);
});
