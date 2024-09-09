import {postBatch} from "../services/postBatch";
import {HandlerWithTokenAuthorizerBuilder, PostBatchesInput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostBatchesInput, any>(async request => {
    const body = request.body ?? null;
    if(!body){
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }
    return await postBatch(body);
});
