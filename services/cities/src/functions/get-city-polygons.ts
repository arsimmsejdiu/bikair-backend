import { getCityPolygons } from "../services/getCityPolygons";
import {GetCityPolygonsInput, GetCityPolygonsOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetCityPolygonsInput, GetCityPolygonsOutput>(async request => {
    const query = request.selectQuery ?? null;

    // const result: any =  await getCityPolygons(query);
    // result.result = result.result.rows;
    // return result;
    // TODO replace with this after 4.11.0 released to fix backoffice
    return await getCityPolygons(query);
});
