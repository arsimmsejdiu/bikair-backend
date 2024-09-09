import {getDeposit} from "../services/getDeposit";
import {GetCautionsInput, GetCautionsOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetCautionsInput, GetCautionsOutput>(async request => {
    const query = request.queryString ?? null;

    return await getDeposit(query);
});
