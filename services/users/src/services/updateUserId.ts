import {UsersModel} from "@bikairproject/lib-manager";

export const updateUserId = async (userId: number, body: any) => {
    try {
        await UsersModel.update({
            status: body?.is_block ? "INACTIVE" : "ACTIVE",
            is_block: body?.is_block,
        }, {
            where: {
                id: userId
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
