import {getBikeStatus} from "../services/getBikeStatus";
import {GetBikesStatusInput, GetBikesStatusOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikesStatusInput, GetBikesStatusOutput>(async request => {
    const bikeName = request.event.pathParameters?.bike_name;
    const userId = Number(request.userId);

    if (!bikeName || Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikeStatus(userId, bikeName);
});
