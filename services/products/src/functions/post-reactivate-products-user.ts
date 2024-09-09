import { reactivateUserProduct } from "../services/reactivateUserProduct";
import { HandlerWithTokenAuthorizerBuilder, PostReactivateProductsUserInput,PostReactivateProductsUserOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostReactivateProductsUserInput, PostReactivateProductsUserOutput>(async request => {
    console.log("run middleware");
    const body = request.body;
    const locale = request.locale;

    if (!body?.subscription_id) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }

    console.log("call  addUserProduct");
    return await reactivateUserProduct(body, locale);
});
