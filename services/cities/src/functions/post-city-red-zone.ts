import {postCityRedZone} from "../services/postCityRedZone";
import { HandlerWithTokenAuthorizerBuilder, PostCreateCityRedZoneOutput, PostCreateCityRedZoneInput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostCreateCityRedZoneOutput, PostCreateCityRedZoneInput>(async request => {
    const body = request.body;
    if(!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await postCityRedZone(body);
})
