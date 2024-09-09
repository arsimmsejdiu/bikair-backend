import {DiscountsUpdate, findOneDiscount, updateDiscount } from "@bikairproject/lib-manager";

export const updateDiscounts = async (body: DiscountsUpdate, locale: string) => {
    try {
        if (
            !body.id ||
            !body.code ||
            !body.type ||
            !body.value ||
            typeof body.reusable === "undefined" ||
            body.reusable === null ||
            !body.status
        ) {
            console.log("Missing required parameters");
            return {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }

        await updateDiscount(body);

        const discount = await findOneDiscount(body.id);

        return {
            statusCode: 200,
            result: discount
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
