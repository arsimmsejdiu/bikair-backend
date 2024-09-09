import {getAccessRights} from "../services/getAccessRights";
import {GetAccessRightsInput,GetAccessRightsOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetAccessRightsInput, GetAccessRightsOutput>(async request => {
    const query = request.selectQuery ?? null;
    return await getAccessRights(query);
});
