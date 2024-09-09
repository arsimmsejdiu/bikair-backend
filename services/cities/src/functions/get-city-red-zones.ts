import { getCityRedZones } from "../services/getCityRedZones";
import {GetCityRedZonesInput, GetCityRedZonesOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetCityRedZonesInput, GetCityRedZonesOutput>(async request => {
    const query = request.selectQuery ?? null;

    // const result: any =  await getCityRedZones(query);
    // result.result = result.result.rows;
    // return result;
    //TODO replace with this after 4.11.0 released to fix backoffice
    return await getCityRedZones(query);
});
