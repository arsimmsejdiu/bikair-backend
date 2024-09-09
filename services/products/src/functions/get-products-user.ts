import { getUserProduct } from "../services/getUserProduct";
import { GetProductsUserInput,GetProductsUserOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetProductsUserInput, GetProductsUserOutput>(async request => {
    console.log("run middleware");
    const userId = request.userId;
    const locale = request.locale;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    console.log("call  addUserProduct");
    return await getUserProduct(userId, locale);
});
