import {getBikesNearBy} from "../services/getBikesNearBy";
import {GetBikesNearbyInput, GetBikesNearbyOutput,HandlerWithoutTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithoutTokenAuthorizerBuilder<GetBikesNearbyInput, GetBikesNearbyOutput>(async request => {
    const origin = request.origin;
    const appVersion = request.appVersion;
    const query = request.queryString;

    if (!origin || !appVersion) {
        console.log("origin : ", origin);
        console.log("appVersion : ", appVersion);
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikesNearBy(origin, appVersion, query);
});

