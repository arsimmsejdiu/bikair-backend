import { ComputedPrice } from "@bikairproject/lib-manager";

export interface ComputedPriceOutput extends ComputedPrice {
    is_discounted?: boolean
}
