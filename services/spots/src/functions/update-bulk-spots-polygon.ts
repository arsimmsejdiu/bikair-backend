import { createPolygonEachSpot } from "../services/createPolygonEachSpot";
import { GetSpotsInput,GetSpotsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetSpotsInput, GetSpotsOutput>(async (request) => {
    const city_id = request.queryString?.city_id ?? null;
    return await createPolygonEachSpot(city_id);
});
