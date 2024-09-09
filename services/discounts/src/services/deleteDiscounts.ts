import { deleteDiscount } from "@bikairproject/lib-manager";

const deleteDiscounts = async (discountId: number) => {
    try {
        if (!discountId) {
            console.log("Missing required parameters");
            return {
                statusCode: 400,
                result: "Missing required parameters",
            };
        }
        await deleteDiscount(discountId);

        return {
            statusCode: 200,
            result: discountId,
        };
    } catch (error) {
        console.log("[ERROR] discountId : ", discountId);
        throw error;
    }
};

export default deleteDiscounts;
