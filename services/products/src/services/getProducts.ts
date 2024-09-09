import { GetProducts } from "../dao/GetProducts";

export const getProducts = async () => {
    try {
        const products = await GetProducts();

        return {
            statusCode: 200,
            result: products
        };
    } catch (error) {
        console.log("[ERROR] get-products : ");
        throw error;
    }
};
