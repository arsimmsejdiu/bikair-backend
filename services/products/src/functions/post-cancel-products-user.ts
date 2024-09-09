import {cancelUserProduct} from "../services/cancelUserProduct";
import {HandlerWithTokenAuthorizerBuilder, PostCancelProductsUserInput,PostCancelProductsUserOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostCancelProductsUserInput, PostCancelProductsUserOutput>(async request => {
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
    return await cancelUserProduct(body, locale);
});
