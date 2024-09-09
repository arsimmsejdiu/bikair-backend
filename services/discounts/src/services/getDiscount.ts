import {DiscountsModel} from "@bikairproject/lib-manager";

const getDiscount = async (discountId: number) => {
    try {
        const result = await DiscountsModel.findByPk(discountId);
        return {
            statusCode: 200,
            result: result,
        };
    } catch (error) {
        console.log("[ERROR] discountId : ", discountId);
        throw error;
    }
};

export default getDiscount;
