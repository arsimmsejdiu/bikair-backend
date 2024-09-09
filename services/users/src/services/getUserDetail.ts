import {GetUserDetail} from "../dao/getUserDetail";

export const getUserDetail = async (userId: number) => {
    try {
        const userDetail = await GetUserDetail(userId);
        if (userDetail === null) {
            return {
                statusCode: 404,
                result: null
            };
        } else {
            return {
                statusCode: 200,
                result: userDetail
            };
        }

    } catch (error) {
        console.log("[ERROR] User detail userId : ", userId);
        throw error;
    }
};
