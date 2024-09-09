import {GetUserEventLogs} from "../dao/getUserEventLogs";

export const getUserEventLogs = async (userId: number) => {
    try {
        const userEventLogs = await GetUserEventLogs(userId);

        return {
            statusCode: 200,
            result: userEventLogs
        };
    } catch (error) {
        console.log("[ERROR] Event Logs userId : ", userId);
        throw error;
    }
};
