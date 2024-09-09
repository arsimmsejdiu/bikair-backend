import {QueryTypes} from "sequelize";

import {getSequelize} from "@bikairproject/lib-manager";

export const deletePaymentMethods = async (uuid: string, userId: number) => {
    try {
        await getSequelize().query(`
            UPDATE payment_methods
            SET status = 'INACTIVE'
            WHERE uuid = :uuid
              AND user_id = :userId
        `, {
            replacements: {
                uuid: uuid,
                userId: userId,
            },
            raw: true,
            plain: true,
            type: QueryTypes.UPDATE
        });

        return {
            statusCode: 204,
        };
    } catch (error) {
        console.log("[ERROR] uuid : ", uuid);
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
