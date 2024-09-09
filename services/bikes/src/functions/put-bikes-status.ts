import {updateBikesStatus} from "../services/updateBikesStatus";
import {HandlerWithTokenAuthorizerBuilder, PutBikesStatusInput, PutBikesStatusOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutBikesStatusInput, PutBikesStatusOutput>(async request => {
    const body = request.body;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateBikesStatus(body);
});
