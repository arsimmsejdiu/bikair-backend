import { checkCityZones } from "../services/checkCityZones";
import {HandlerWithTokenAuthorizerBuilder, PostCheckZoneInput, PostCheckZoneOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostCheckZoneInput, PostCheckZoneOutput>(async request => {
    const body = request.body;
    const locale = request.locale;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await checkCityZones(body, locale);
});
