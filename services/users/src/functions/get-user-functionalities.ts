import { getUserFunctionalities } from "../services/getUserFunctionalities";
import { GetUserFunctionalitiesInput,GetUserFunctionalitiesOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";


export const handler = HandlerWithTokenAuthorizerBuilder<GetUserFunctionalitiesInput, GetUserFunctionalitiesOutput>(async request => {
    const query = request.queryString;
    const context: string = request.origin ?? "MOBILE_APP";

    return await getUserFunctionalities(context, query);
});
