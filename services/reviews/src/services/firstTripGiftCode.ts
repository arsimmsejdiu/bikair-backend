import { MICROSERVICE_NOTIFICATION } from "../config/config";
import { SendMessage } from "@bikairproject/fcm";
import { invokeAsync } from "@bikairproject/lambda-utils";
import { DISCOUNT_CODE, ErrorUtils, findDiscountByCode, STATUS, TranslateUtils, TRIP_STATUS,TripsModel, UserDiscountsModel, UserSettingsModel, UsersModel } from "@bikairproject/lib-manager";

/**
 * Create a discount code for first trip of a new user
 * @param {*} userId
 * @param {*} rate integer | user trip notation
 * @returns
 */
export const firstTripGiftCode = async (userId: number, rate: number) => {
    try {
        const trips = await TripsModel.findAll({
            where: {
                user_id: userId,
                status: [TRIP_STATUS.PAYMENT_SUCCESS, TRIP_STATUS.FREE_TRIP, TRIP_STATUS.DISCOUNTED, TRIP_STATUS.PASS, TRIP_STATUS.SUBSCRIPTION, TRIP_STATUS.EXPERIMENTATION]
            }
        });

        const isFirstTrip = trips && trips.length === 1;

        // Ensure user has only one trip
        if (isFirstTrip) {
            // let discount;
            const user = await UsersModel.findOne({
                where: {
                    id: userId
                }
            });
            const userSettings = await UserSettingsModel.findOne({
                where: {
                    user_id: userId
                }
            });
            // if (rate >= 4) {
            //     // Create a code with 30% discount
            //     discount = await findDiscountByCode(
            //         DISCOUNT_CODE.NOUVEAUTRAJET
            //     );
            // } else {
            //     // Create a 15 minutes discount
            //     discount = await findDiscountByCode(
            //         DISCOUNT_CODE.TRAJETGRATUIT
            //     );
            // }
            // await UserDiscountsModel.create({
            //     user_id: userId,
            //     discount_id: discount.id,
            //     used: false,
            //     status: STATUS.ACTIVE,
            //     code_ref: discount.code,
            //     remaining: discount.value
            // });

            if ((userSettings && userSettings.device_token) && user) {
                const i18n = new TranslateUtils(user?.locale ?? "en");
                await i18n.init();
                // const title = i18n.t(`trips.first_trip.${discount.code}.title`);
                // const message = i18n.t(`trips.first_trip.${discount.code}.message`);
                // await SendMessage([userSettings.device_token], title, message);


                console.log("Send notification for deposit!");
                const _trips = await TripsModel.findAll({
                    where: {
                        user_id: userId,
                        status: [TRIP_STATUS.PAYMENT_SUCCESS, TRIP_STATUS.FREE_TRIP, TRIP_STATUS.PAYMENT_HOLD_CONFIRM, TRIP_STATUS.WAIT_VALIDATION, TRIP_STATUS.CLOSED, TRIP_STATUS.DISCOUNTED, TRIP_STATUS.PASS, TRIP_STATUS.SUBSCRIPTION, TRIP_STATUS.EXPERIMENTATION]
                    }
                });
                if (_trips && _trips.length === 1) {
                    const titleDeposit = i18n.t("trips.deposit.title");
                    const messageDeposit = i18n.t("trips.deposit.message");
                    await SendMessage([userSettings.device_token], titleDeposit, messageDeposit);
                }
            }
        }

        return;
    } catch (error: any) {
        console.log("Error while trying to handle discount first trip");
        console.log(error);
        const payload = await ErrorUtils.getSlackErrorPayload("firstTripGiftCode", error);
        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
    }
};
