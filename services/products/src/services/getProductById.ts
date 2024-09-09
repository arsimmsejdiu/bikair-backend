import {APIGatewayProxyEventQueryStringParameters} from "aws-lambda";

import {computePrice, DiscountInput} from "./computePrice";
import {findFunctionalitiesForCity, getProductsDetailsById, GetUserDiscountForProduct} from "@bikairproject/lib-manager";


export const getProductById = async (userId: number, productId: number, origin: string, query?: APIGatewayProxyEventQueryStringParameters) => {
    try {
        if (!query?.city_id) {
            return {
                statusCode: 404,
                result: null
            };
        }

        const functionalities = await findFunctionalitiesForCity(parseInt(query.city_id), origin);
        const functionalitiesName = functionalities.map(el => el.name);

        console.log("functionalitiesNames = ", functionalitiesName);

        const product = await getProductsDetailsById(productId, functionalitiesName);

        if (!product) {
            return {
                statusCode: 404,
                result: null
            };
        }

        const productDiscount = await GetUserDiscountForProduct(userId, product.id);

        let discountInput: DiscountInput | null = null;
        if (productDiscount) {
            discountInput = {
                id: productDiscount.discount_id,
                code: productDiscount.code,
                type: productDiscount.type,
                value: productDiscount.value ?? 0
            };
        }
        product.computedPrice = computePrice(discountInput, product.price);


        console.log(product);
        return {
            statusCode: 200,
            result: product
        };
    } catch (error) {
        console.log("[ERROR] get-products : ");
        throw error;
    }
};
