import { deleteBatch } from "../services/deleteBatch";
import { HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<any, any>(async request => {
    const id = Number(request.pathParams?.id) ?? null;
    return await deleteBatch(id);
});
