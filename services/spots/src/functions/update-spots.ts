import { updateSpot } from "../services/updateSpot";
import { HandlerWithTokenAuthorizerBuilder, PutUpdateSpotsInput,PutUpdateSpotsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutUpdateSpotsInput, PutUpdateSpotsOutput>(async request => {
    const body = request.body;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateSpot(body);
});
