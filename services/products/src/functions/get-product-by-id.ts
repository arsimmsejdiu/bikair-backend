import {getProductById} from "../services/getProductById";
import {GetProductByIdInput,GetProductByIdOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetProductByIdInput, GetProductByIdOutput>(async request => {
    const userId = request.userId;
    const query = request.queryString;
    const origin = request.origin;
    const productId = Number(request.pathParams?.product_id);

    if (Number.isNaN(userId) || Number.isNaN(productId) || !origin) {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await getProductById(userId, productId, origin, query);
});
