import { putMarketings } from "../services/putMarketings";
import {HandlerWithTokenAuthorizerBuilder, PutMarketingsInput, PutMarketingsOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutMarketingsInput, PutMarketingsOutput>(async request => {
    const body = request.body ?? null;
    const id = Number(request.pathParams?.id) ?? null;
    if(!id || !body){
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    body.id = id;
    return await putMarketings(body);
});
