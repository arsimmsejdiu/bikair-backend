import {Transaction} from "sequelize";

import {SendMessage} from "@bikairproject/fcm";
import {DiscountsModel, TranslateUtils, UserDiscountsModel} from "@bikairproject/lib-manager";
import {NearestSpot, STATUS} from "@bikairproject/lib-manager";
import {generateRandomCode} from "@bikairproject/lib-manager";


export const checkSpotArea = async (userId: number, deviceToken: string, spot: NearestSpot | null, locale: string, transaction?: Transaction) => {
    try {
        const discount = await DiscountsModel.findOne({
            where: {
                code: "SPOT_PARKING"
            }
        });
        if (discount) {
            if (spot) {
                console.log("Creating a discount code for user : ", userId);
                await createNewDiscount(userId, discount, transaction);
            } else {
                console.log("not in spot");
            }
            await sendNotification(deviceToken, locale, spot !== null);
        } else {
            console.log("Code SPOT_PARKING not found");
        }
    } catch (err) {
        console.log("checkSpotArea", err);
    }
};


export const createNewDiscount = async (userId: number, discount: DiscountsModel, transaction?: Transaction) => {
    await UserDiscountsModel.findOrCreate({
        where: {
            user_id: userId,
            discount_id: discount.id,
            used: false,
            status: STATUS.ACTIVE
        },
        defaults: {
            user_id: userId,
            discount_id: discount.id,
            remaining: discount.value,
            used: false,
            status: STATUS.ACTIVE,
            code_ref: generateRandomCode()
        },
        transaction: transaction
    });
};

export const sendNotification = async (deviceToken: string, locale: string, promoOk: boolean) => {
    console.log("Sending notification for spot-parking at token_device ", deviceToken);
    const i18n = new TranslateUtils(locale);
    await i18n.init();
    let title, message;
    if (deviceToken) {
        if (promoOk) {
            title = i18n.t("trips.spots.promo_ok_title");
            message = i18n.t("trips.spots.promo_ok_message");
            await SendMessage([deviceToken], title, message);
        } else {
            title = i18n.t("trips.spots.promo_no_ok_title");
            message = i18n.t("trips.spots.promo_no_ok_message");
            // await SendMessage([deviceToken], title, message)
        }
    }
};
