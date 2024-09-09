import {ProductsInput} from "../model/ProductInput";
import {addUserPass} from "./addUserPass";
import {addUserSubscription} from "./addUserSubscription";
import {PaymentMethodsModel, PostProductsUserInput, ProductsModel, ProductType,ProductVariationsModel, UsersModel} from "@bikairproject/lib-manager";

export const addUserProduct = async (userId: number, body: PostProductsUserInput, locale: string) => {
    try {
        if (!body.city_id) {
            return {
                statusCode: 403,
                result: "PRODUCT_UNAVAILABLE"
            };
        }

        const user = await UsersModel.findByPk(userId);
        if (!user) {
            return {
                statusCode: 404,
                result: "NO_USER_FOUND"
            };
        }

        let productVariant: ProductVariationsModel | null = null;
        if (body.product_variation_id) {
            console.log("Looking for variation ", body.product_variation_id);
            productVariant = await ProductVariationsModel.findByPk(body.product_variation_id);
        }
        if (productVariant) {
            body.product_id = productVariant.product_id;
        }

        const product = await ProductsModel.findByPk(body.product_id) as ProductsInput;
        if (!product) {
            return {
                statusCode: 404,
                result: "NO_PRODUCT_FOUND"
            };
        }

        if (productVariant) {
            console.log("Replacing product info with product variant");
            product.product_variation = productVariant;
            product.description = productVariant.description;
            product.price = productVariant.price;
            product.max_usage = productVariant.max_usage;
            product.discount_id = productVariant.discount_id;
            product.discount_type = productVariant.discount_type;
            product.discount_value = productVariant.discount_value;
        }

        if(product.price === 0 || product.price < 0){
            return {
                statusCode: 404,
                result: "NO_PRODUCT_FOUND"
            };
        }

        const payment_method = await PaymentMethodsModel.findOne({
            where: {
                user_id: user.id,
                status: "ACTIVE"
            }
        });
        if (!payment_method) {
            return {
                statusCode: 404,
                result: "MISSING_PM"
            };
        }

        switch (product.type) {
            case ProductType.SUBSCRIPTION:
                return await addUserSubscription(body.city_id, user, product, payment_method, locale);
            case ProductType.PASS:
                return await addUserPass(body.city_id, user, product, payment_method, locale);
            default:
                return {
                    statusCode: 400,
                    result: "Unknown product type."
                };
        }
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
