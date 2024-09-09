import { UserSettingsModel, PutUserSettingsInput } from "@bikairproject/lib-manager";

export const updateUserSettings = async (userId: number, body: PutUserSettingsInput, osVersion: string, brand: string) => {
    try {
        await UserSettingsModel.update({
            device_token: body.device_token,
            topics: body.topics,
            device_brand: brand,
            device_os_version: osVersion,
            reminder: body.reminder,
            unread_tickets: body.unread_tickets,
        }, {
            where: {
                user_id: userId
            }
        });

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
