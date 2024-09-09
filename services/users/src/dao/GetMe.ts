import { QueryTypes } from "sequelize";

import { getSequelize } from "@bikairproject/lib-manager";
import {Users} from "@bikairproject/lib-manager";

interface GetMeData extends Users {
    age: number;
    city_name?: string | null;
    topics?: string[] | null;
    card_token?: string | null
    device_token?: string | null
    unread_tickets?: number | null,
    deposit_expiration_date?: string | null
}

/**
 *
 * @returns
 */
export const GetMe = async (userId: number) => {
    return await getSequelize().query<GetMeData>(
        `
            SELECT 
                u.*,
                EXTRACT(YEAR FROM age(u.birthdate::date)) as age,
                u.birthdate::timestamp AS birthdate,
                c.name                    AS city_name,
                s.topics,
                p.card_token,
                s.device_token,
                s.unread_tickets,
                td.created_at + INTERVAL '7 days' AS deposit_expiration_date
            FROM users u
                LEFT JOIN payment_methods p ON u.id = p.user_id AND p.status = 'ACTIVE'
                LEFT JOIN cities c ON c.id = u.city_id
                LEFT JOIN user_settings s ON u.id = s.user_id
                LEFT JOIN trip_deposits td ON u.id = td.user_id AND td.status = 'ACTIVE'
            WHERE u.id = $1
        `,
        {
            bind: [userId],
            raw: false,
            plain: true,
            type: QueryTypes.SELECT
        }
    );
};
