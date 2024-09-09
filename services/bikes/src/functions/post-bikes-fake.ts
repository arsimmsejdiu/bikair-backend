import {createFakeBikes} from "../services/createFakeBikes";
import {HandlerWithTokenAuthorizerBuilder, PostBikesFakeInput, PostBikesFakeOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostBikesFakeInput, PostBikesFakeOutput>(async request => {
    const nBike = Number(request.queryString?.bike ?? "0");

    if (Number.isNaN(nBike)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createFakeBikes(nBike);
});
