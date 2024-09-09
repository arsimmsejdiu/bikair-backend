import {GetCityRedZoneInput, GetCityRedZoneOutput, HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";
import {getCityRedZone} from "../services/getCityRedZone";

export const handler = HandlerWithTokenAuthorizerBuilder<GetCityRedZoneInput, GetCityRedZoneOutput>(async request => {
    const id = Number(request.pathParams?.city_id);
    if (Number.isNaN(id)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getCityRedZone(id);
});
