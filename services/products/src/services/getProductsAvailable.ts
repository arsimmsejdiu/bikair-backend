import {APIGatewayProxyEventQueryStringParameters} from "aws-lambda";

import {computePrice, DiscountInput} from "./computePrice";
import {DISCOUNT_CODE, findFunctionalitiesForCity, getProductsDetails, GetUserDiscountForProduct,ProductDetail} from "@bikairproject/lib-manager";


const getWeight = (d: ProductDetail) => {
    let weight = 100;
    if (d.recurring) {
        weight = 1;
    } else {
        switch (d.discount_type) {
            case DISCOUNT_CODE.ONE_SHOT:
                weight = 10;
                break;
            case DISCOUNT_CODE.PACK:
                weight = 20;
                break;
            case DISCOUNT_CODE.PERCENT:
                weight = 50;
                break;
            default:
                weight = 100;
                break;
        }
    }
    return weight;
};

export const getProductsAvailable = async (userId: number, origin: string, query?: APIGatewayProxyEventQueryStringParameters) => {
    try {
        if (!query?.city_id) {
            return {
                statusCode: 200,
                result: []
            };
        }

        const functionalities = await findFunctionalitiesForCity(parseInt(query.city_id), origin);
        const functionalitiesName = functionalities.map(el => el.name);

        console.log("functionalitiesNames = = ", functionalitiesName);

        const products = await getProductsDetails(functionalitiesName);

        for (const p of products) {
            const productDiscount = await GetUserDiscountForProduct(userId, p.id);
            let discountInput: DiscountInput | null = null;
            if (productDiscount) {
                discountInput = {
                    id: productDiscount.discount_id,
                    code: productDiscount.code,
                    type: productDiscount.type,
                    value: productDiscount.value ?? 0
                };
            }
            p.computedPrice = computePrice(discountInput, p.price);
            if (p.product_variations) {
                for (const variation of p.product_variations) {
                    variation.computedPrice = computePrice(discountInput, variation.price);
                }
            }
        }

        products.sort((a, b) => {
            const weightA = getWeight(a);
            const weightB = getWeight(b);
            const weightResult = weightA - weightB;
            if (weightResult === 0) {
                return a.id - b.id;
            } else {
                return weightResult;
            }
        });

        console.log(products);

        return {
            statusCode: 200,
            result: products
        };
    } catch (error) {
        console.log("[ERROR] get-products : ");
        throw error;
    }
};
