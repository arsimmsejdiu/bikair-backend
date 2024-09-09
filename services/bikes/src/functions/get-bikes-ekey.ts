import {getBikesEkey} from "../services/getBikesEkey";
import {GetBikesEkeyInput, GetBikesEkeyOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikesEkeyInput, GetBikesEkeyOutput>(async request => {
    const locale = request.locale;
    const userId = request.userId;
    const role = request.role;
    const bikeId = Number(request.event.pathParameters?.bike_id);

    if (Number.isNaN(userId) || Number.isNaN(bikeId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikesEkey(bikeId, userId, role, locale);
});
