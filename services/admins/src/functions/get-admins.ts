import { getAdmins } from "../services/getAdmins";
import { GetAdminsInput, GetAdminsOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetAdminsInput, GetAdminsOutput>(async request => {
    return await getAdmins(request.selectQuery ?? null);
});
