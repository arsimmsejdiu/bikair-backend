import { postMarketings } from "../services/postMarketings";
import {HandlerWithTokenAuthorizerBuilder, PostMarketingsInput, PostMarketingsOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostMarketingsInput, PostMarketingsOutput>(async request => {
    const body = request.body ?? null;
    if(!body){
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    return await postMarketings(body);
});
