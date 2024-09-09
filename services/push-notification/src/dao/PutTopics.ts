import { UserSettingsModel } from "@bikairproject/lib-manager";

/** @deprecated in favor of put-user-setting in services/users*/
export const PutTopics = async (topics: string[], userId: number) => {
    try {
        await UserSettingsModel.update({
            topics: topics
        }, {
            where: {
                user_id: userId
            }
        });

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
