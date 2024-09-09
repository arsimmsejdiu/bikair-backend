import {ProductsModel, ProductVariationsModel} from "@bikairproject/lib-manager";

export interface ProductsInput extends ProductsModel {
    product_variation?: ProductVariationsModel | null;
}
