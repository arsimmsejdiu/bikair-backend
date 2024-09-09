import { ActivationCodesModel, ProductsModel } from "@bikairproject/database";
import { mailGiftCard } from "@bikairproject/mailing";
import { generateRandomCode } from "@bikairproject/utils";

export const handlePaymentLink = async (email: string, name: string, phone: string, checkoutSession: any) => {    
    const code = generateRandomCode().toUpperCase();
    const product = await ProductsModel.findOne({where: {provider_id: checkoutSession.line_items.data[0].price.product }});
    if(product){
        await ActivationCodesModel.create({
            code: code,
            email: email,
            target_id: product.discount_id,
            type: "DISCOUNT",
            price: product.price
        });
        await mailGiftCard(email, name, code, checkoutSession.custom_fields); 
    }
};
