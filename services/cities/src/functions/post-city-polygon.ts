import {postCityPolygon} from "../services/postCityPolygon";
import { HandlerWithTokenAuthorizerBuilder, PostCreateCityPolygonInput, PostCreateCityPolygonOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostCreateCityPolygonOutput, PostCreateCityPolygonInput>(async request => {
    const body = request.body;
    if(!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await postCityPolygon(body);
})
