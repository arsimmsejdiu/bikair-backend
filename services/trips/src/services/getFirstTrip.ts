import {SendMessage} from "@bikairproject/fcm";
import {
    TranslateUtils,
    TripsModel,
    UserDiscountsModel,
    UserNotificationsModel,
    UserSettingsModel
} from "@bikairproject/lib-manager";
import {DISCOUNT_CODE, TRIP_STATUS} from "@bikairproject/lib-manager";

export const getFirstTrip = async (userId: number, locale: string) => {
    try {
        const userSettings = await UserSettingsModel.findOne({
            where: {user_id: userId}
        });
        const trips = await TripsModel.findAll({
            where: {
                user_id: userId,
                status: [TRIP_STATUS.PAYMENT_SUCCESS, TRIP_STATUS.FREE_TRIP, TRIP_STATUS.DISCOUNTED, TRIP_STATUS.PASS, TRIP_STATUS.SUBSCRIPTION, TRIP_STATUS.EXPERIMENTATION]
            }
        });
        const i18n = new TranslateUtils(locale);
        await i18n.init();
        if (trips && trips.length === 1) {

            // Send push-notification with code
            // const userDiscount = await UserDiscountsModel.findOne({
            //     where: {
            //         user_id: userId,
            //         code_ref: [
            //             DISCOUNT_CODE.NOUVEAUTRAJET,
            //             DISCOUNT_CODE.TRAJETGRATUIT
            //         ]
            //     }
            // });
            //

            // if (userDiscount && userSettings && userSettings.device_token) {
            //     const title = i18n.t(`trips.first_trip.${userDiscount.code_ref}.title`);
            //     const message = i18n.t(`trips.first_trip.${userDiscount.code_ref}.message`);
            //
            //     const notification = await UserNotificationsModel.findOne({
            //         where: {
            //             title: title,
            //             message: message,
            //             user_id: userId
            //         }
            //     });
            //     console.log("Notification : ", notification);
            //     if (notification === null) {
            //         await SendMessage([userSettings.device_token], title, message);
            //     } else {
            //         console.log("can't send notification");
            //     }
            // } else {
            //     console.log("missing userDiscount or userSettings");
            // }
            return {
                statusCode: 200,
                result: trips[0]
            };
        } else if (trips.length === 3) {
            console.log("Sending notification for spot-parking at token_device ", userSettings?.device_token);
            const title = i18n.t("trips.third_trip_offers.title");
            const message = i18n.t("trips.third_trip_offers.message");
            const notification = await UserNotificationsModel.findOne({
                where: {
                    title: title,
                    message: message,
                    user_id: userId
                }
            });
            if (userSettings?.device_token && notification === null) {
                await SendMessage([userSettings.device_token], title, message, "Subscription");
            }
        } else {
            console.log(`Nothing to do with ${trips.length} trips`);
        }

        return {
            statusCode: 203
        };
    } catch (error) {
        console.log("[ERROR] first trip check : ", userId);
        throw error;
    }
};
