import {QueryTypes} from "sequelize";

import {getSequelize} from "@bikairproject/lib-manager";
import {GetUserDetailOutput} from "@bikairproject/lib-manager";

export const GetUserDetail = async (userId: number) => {
    return await getSequelize().query<GetUserDetailOutput>(`
        SELECT  u.*,
                us.device_brand AS os,
                case when td.status = 'ACTIVE' then TRUE else FALSE end as deposit_status,
                td.payment_intent AS deposit_stripe_id 
        FROM users u
            LEFT JOIN user_settings us on u.id = us.user_id
            LEFT JOIN trip_deposits td on u.id = td.user_id AND td.status = 'ACTIVE'
        WHERE u.id = :userId
    `,{
        replacements: {
            userId: userId
        },
        raw: false,
        plain: true,
        type: QueryTypes.SELECT
    });
};
