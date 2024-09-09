import { createStripeDiscount } from "./createStripeCoupon";
import { DISCOUNT_CODE, DiscountsModel,PostDiscountsInput, STATUS } from "@bikairproject/lib-manager";

const createDiscounts = async (body: PostDiscountsInput, locale: string) => {
    try {
        if (
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

        const existingDiscount = await DiscountsModel.findOne({
            where: {
                code: body.code
            }
        });

        if(existingDiscount) {
            return {
                statusCode: 409,
                result: `Le code ${body.code} existe déjà.`
            };
        }

        const discount = await DiscountsModel.create({
            code: body.code,
            type: body.type,
            value: body.value,
            reusable: body.reusable,
            status: body.status,
            expired_at: body.expired_at,
            product_id: body.product_id
        });

        // We create a stripe coupon if necessary
        if (body.product_id && body.provider_duration) {
            let coupon_type: string | null = null;
            if (body.type === DISCOUNT_CODE.PERCENT) coupon_type = "percent_off";
            if (body.type === DISCOUNT_CODE.ABSOLUTE) coupon_type = "amount_off";
            if (!coupon_type) throw new Error("You must specify a coupon type PERCENT or ABSOLUTE");

            const stripeCoupon = await createStripeDiscount(body.product_id, body.code, body.value, body.provider_duration, coupon_type);
            if(stripeCoupon){
                await DiscountsModel.update({ provider_id: stripeCoupon.id }, {
                    where: { id: discount.id }
                });
            }
        }

        return {
            statusCode: 201,
            result: discount
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};

export default createDiscounts;
