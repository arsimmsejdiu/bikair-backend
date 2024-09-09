import {
    STRIPE_SECRET_KEY,
    STRIPE_TAX_RATES
} from "../config/config";
import { Products, ProductsModel, STRIPE_DURATION } from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";
/**
 *
 * @param productId
 * @param code
 * @param value
 * @param duration  provider_durationIndicates how long the coupon is valid for. Values include ONCE, FOREVER, or REPEATING.
 * @param coupon_type percent_off or amount_offThe amount that is taken off the subtotal for the duration of the coupon.
 * @returns
 */
export const createStripeDiscount = async (
    productId: number,
    code: string,
    value: number,
    duration: STRIPE_DURATION,
    coupon_type: string) => {

    // Verify which type of product
    const product: Products | null = await ProductsModel.findByPk(productId);
    if(!product) throw new Error("No product found!");

    if(product.recurring){
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);
        return await stripeApi.createDiscountForSubscription(duration, code, value, coupon_type);
    }

    return false;
};
