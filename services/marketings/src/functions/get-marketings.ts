import { getMarketings } from "../services/getMarketings";
import { GetMarketingsInput, GetMarketingsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetMarketingsInput, GetMarketingsOutput>(async request => {
    const query = request.selectQuery ?? null;
    return await getMarketings(query);
});
