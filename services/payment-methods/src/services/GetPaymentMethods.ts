import { PaymentMethodsModel } from "@bikairproject/lib-manager";

export const getPaymentMethods = async (userId: number, localeHeader: string) => {
    try {
        const paymentMethod = await PaymentMethodsModel.findOne({
            where: {
                user_id: userId,
                status: "ACTIVE"
            }
        });

        if (!paymentMethod) {
            return {
                statusCode: 200,
                result: null
            };
        }

        return {
            statusCode: 200,
            result: {
                card_token: paymentMethod.card_token,
                brand: paymentMethod.brand,
                exp_year: paymentMethod.exp_year,
                exp_month: paymentMethod.exp_month,
                last_4: paymentMethod.last_4,
                country: paymentMethod.country,
                uuid: paymentMethod.uuid
            }
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
