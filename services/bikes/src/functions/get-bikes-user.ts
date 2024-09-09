import { getBikesUser } from "../services/getBikesUser";
import { GetBikesUserInput,GetBikesUserOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";


export const handler = HandlerWithTokenAuthorizerBuilder<GetBikesUserInput, GetBikesUserOutput>(async request => {
    const origin = request.origin;
    const appVersion = request.appVersion;
    const userId = request.userId;
    const query = request.queryString;

    console.log("userId : ", userId);
    console.log("context userId : ", request.event.requestContext.authorizer?.userId);

    if (Number.isNaN(userId) || !origin || !appVersion) {
        console.log("userId : ", userId);
        console.log("origin : ", origin);
        console.log("appVersion : ", appVersion);
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikesUser(userId, origin, appVersion, query);
});

