import { addUserProduct } from "../services/addUserProduct";
import { HandlerWithTokenAuthorizerBuilder, PostProductsUserInput,PostProductsUserOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostProductsUserInput, PostProductsUserOutput>(async request => {
    console.log("run middleware");
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    if (!body?.product_id && !body?.product_variation_id) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }

    console.log("call  addUserProduct");
    return await addUserProduct(userId, body, locale);
});
