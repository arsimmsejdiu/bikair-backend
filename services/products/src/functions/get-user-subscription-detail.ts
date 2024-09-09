import {getUserSubscriptionDetail} from "../services/getUserSubscriptionDetail";
import {GetSubscriptionDetailInput,GetSubscriptionDetailOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetSubscriptionDetailInput, GetSubscriptionDetailOutput>(async request => {
    const id = Number(request.pathParams?.subscription_id);
    if(!id) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMSs"
        };
    }
    return await getUserSubscriptionDetail(id);
});
