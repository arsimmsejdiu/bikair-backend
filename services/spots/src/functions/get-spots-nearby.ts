import { getSpotsNearBy } from "../services/getSpotsNearBy";
import { GetSpotsNearbyInput,GetSpotsNearbyOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetSpotsNearbyInput, GetSpotsNearbyOutput>(async request => {
    const query = request.queryString ?? null;
    const origin = request.origin ?? "MOBILE_APP";

    return await getSpotsNearBy(query, origin);
});
