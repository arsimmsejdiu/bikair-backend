import { UserSettingsModel } from "@bikairproject/lib-manager";

export const getUserSettings = async (userId: number) => {
    try {
        const userSettings = await UserSettingsModel.findOne({
            where: {
                user_id: userId
            }
        });

        if (!userSettings) {
            return {
                statusCode: 404,
                result: null
            };
        }

        return {
            statusCode: 200,
            result: userSettings
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
