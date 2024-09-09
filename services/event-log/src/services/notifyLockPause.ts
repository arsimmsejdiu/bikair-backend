import { SendMessage } from "@bikairproject/fcm";
import { TranslateUtils, TripsModel, UserSettingsModel } from "@bikairproject/lib-manager";

const notifyLockPause = async (userId: number, locale = "fr") => {
    try {
        const trip = await TripsModel.findOne({
            where: {
                user_id: userId,
                status: "OPEN"
            }
        });
        const userSettings = await UserSettingsModel.findOne({
            where: {
                user_id: userId
            }
        });

        if (!trip || !userSettings) {
            return {
                statusCode: 404,
                result: "Not found"
            };
        }
        if(userSettings.device_token){
            const i18n = new TranslateUtils(locale ?? "fr");
            await i18n.init();
            const title = i18n.t("trips.pause.title");
            const message = i18n.t("trips.pause.message");

            // Send notification for each device_tokens
            await SendMessage([userSettings.device_token], title, message, undefined, undefined, false);
        }

        return {
            statusCode: 200
        };
    } catch (error) {
        console.log("[ERROR] userId: ", userId);
        throw error;
    }
};

export default notifyLockPause;
