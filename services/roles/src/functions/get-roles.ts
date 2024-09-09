import {getRoles} from "../services/getRoles";
import {GetRolesInput,GetRolesOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetRolesInput, GetRolesOutput>(async request => {
    const query = request.selectQuery ?? null;
    return await getRoles(query);
});
