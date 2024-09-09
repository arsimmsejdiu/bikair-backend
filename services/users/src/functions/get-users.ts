import { getUsers } from "../services/getUsers";
import { GetUsersInput, GetUsersOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUsersInput, GetUsersOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getUsers(query);
});
