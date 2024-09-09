import { deleteMarketings } from "../services/deleteMarketings";
import { HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<undefined, undefined>(async request => {
    const id = Number(request.pathParams?.id) ?? null;
    return await deleteMarketings(id);
});
