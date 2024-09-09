import {updateBikesAddress} from "../services/updateBikesAddress";
import {HandlerWithTokenAuthorizerBuilder, PutBikesAddressInput, PutBikesAddressOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutBikesAddressInput, PutBikesAddressOutput>(async request => {
    const bikeId = Number(request.event.pathParameters?.bike_id);

    if (Number.isNaN(bikeId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateBikesAddress(bikeId);
});
