import { putBatch } from "../services/putBatch";
import { HandlerWithTokenAuthorizerBuilder, PutBatchesInput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutBatchesInput, any>(async request => {
    const body = request.body ?? null;
    const id = Number(request.pathParams?.id) ?? null;
    if(!id || !body){
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    return await putBatch(id, body);
});
