import { getMarketing } from "../services/getMarketing";
import {GetMarketingInput,GetMarketingOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetMarketingInput, GetMarketingOutput>(async request => {
    const id = Number(request.pathParams?.id) ?? null;
    if(!id){
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    return await getMarketing(id);
});
