import { getSpots } from "../services/getSpots";
import { GetSpotsInput,GetSpotsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetSpotsInput, GetSpotsOutput>(async request => {
    const query = request.queryString ?? null;

    return await getSpots(query);
});
