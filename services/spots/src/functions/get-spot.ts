import { getSpot } from "../services/getSpot";
import { GetSpotInput,GetSpotOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";


export const handler = HandlerWithTokenAuthorizerBuilder<GetSpotInput, GetSpotOutput>(async request => {
    const spotId = Number(request.event.pathParameters?.spot_id);

    if (Number.isNaN(spotId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getSpot(spotId);
});
