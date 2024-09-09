import { AdminsModel, UserSettingsModel } from "@bikairproject/lib-manager";

/** @deprecated in favor of put-user-setting in services/users*/
/**
 *
 * @param {*} token This is the user device token - Its updated everytime a user open his application
 * @param {*} userId
 * @param {*} headers
 * @returns
 */
export const PutToken = async (token: string, userId: number, headers: Record<string, string | undefined>) => {
    const osVersion = headers["x-os-version"];
    const brand = headers["x-brand"];
    const origin = headers["x-origin"];

    try {
        if (origin === "MOBILE_APP") {
            const userSetting = await UserSettingsModel.findOne({
                where: {
                    user_id: userId
                }
            });
            if (userSetting) {
                await UserSettingsModel.update({
                    device_token: token,
                    device_brand: brand,
                    device_os_version: osVersion
                }, {
                    where: {
                        user_id: userId
                    }
                });
            } else {
                await UserSettingsModel.create({
                    user_id: userId,
                    device_token: token,
                    device_brand: brand,
                    device_os_version: osVersion,
                    topics: ["PROMOTIONS", "INFORMATIONS"]
                });
            }
        } else {
            await AdminsModel.update({
                device_token: token
            }, {
                where: {
                    id: userId
                }
            });
        }

        return {
            statusCode: 200,
            result: "OK"
        };
    } catch (err) {
        console.log("[ERROR]", err);
        return {
            statusCode: 400,
            result: err
        };
    }
};
