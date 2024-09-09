import { GetUserDiscounts } from "../dao/GetUserDiscounts";

/**
 *
 * @returns
 */
export const getDiscounts = async (userId: number) => {
    try {
        const discounts = await GetUserDiscounts(userId);
        console.log(`Found ${discounts.length} discounts.`);

        return {
            statusCode: 200,
            result: discounts
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
