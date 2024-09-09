import {GetCityPolygonInput, GetCityPolygonOutput, HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";
import {getCityPolygon} from "../services/getCityPolygon";

export const handler = HandlerWithTokenAuthorizerBuilder<GetCityPolygonInput, GetCityPolygonOutput>(async request => {
    const id = Number(request.pathParams?.city_id);
    if (Number.isNaN(id)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getCityPolygon(id);
});
