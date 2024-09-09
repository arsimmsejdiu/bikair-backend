import { createSpot } from "../services/createSpot";
import { HandlerWithTokenAuthorizerBuilder, PostCreateSpotsInput,PostCreateSpotsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostCreateSpotsInput, PostCreateSpotsOutput>(async request => {
    const body = request.body;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createSpot(body);
});
