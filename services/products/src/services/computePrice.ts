import { ComputedPrice, DISCOUNT_CODE, TRIP_STATUS } from "@bikairproject/lib-manager";

export interface DiscountInput {
    id: number, 
    code: string,
    type: string,
    value: number
}

export const computePrice = (discount: DiscountInput | null, price: number): ComputedPrice => {
    const basePrice = price;
    const result: ComputedPrice = {
        price: basePrice,
        discounted_amount: basePrice,
        reduction: 0,
        minutes: 0,
        code: null,
        discount_id: null,
        user_subscription_id: null
    };

    if (!discount) {
        return result;
    }

    const reduction = getReduction(discount, basePrice);
    result.reduction = reduction;
    result.discounted_amount = basePrice - reduction;

    if (result.discounted_amount > 0) {
        result.status = TRIP_STATUS.DISCOUNTED;
        result.discount_id = discount.id ?? null;
        result.code = discount.code;
    }

    return result;
};

const getReduction = (discount: DiscountInput, basePrice: number) => {
    let reduction = 0;

    // Take the first discount from the list
    switch (discount.type) {
        case DISCOUNT_CODE.PERCENT:
        case DISCOUNT_CODE.PRODUCTS_PERCENT:
            reduction = Math.floor(basePrice * ((discount.value ?? 0) / 100));
            break;
        case DISCOUNT_CODE.ABSOLUTE:
        case DISCOUNT_CODE.PRODUCT_ABSOLUTE:
            reduction = discount.value ?? 0;
            break;
        default:
            break;
    }

    return reduction;
};
