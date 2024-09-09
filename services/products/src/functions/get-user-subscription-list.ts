import {getUserSubscriptionList} from "../services/getUserSubscriptionList";
import {GetUserSubscriptionListInput,GetUserSubscriptionListOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserSubscriptionListInput, GetUserSubscriptionListOutput>(async request => {
    const query = request.selectQuery ?? null;
    return await getUserSubscriptionList(query);
});
