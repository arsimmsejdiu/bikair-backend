import { getProducts } from "../services/getProducts";
import { GetProductsInput,GetProductsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetProductsInput, GetProductsOutput>(async request => {
    return await getProducts();
});
