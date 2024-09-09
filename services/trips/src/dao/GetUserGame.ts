import { QueryTypes, Transaction } from "sequelize";

import { getSequelize } from "@bikairproject/lib-manager";

export const GetUserGame = async (userId: number, transaction?: Transaction): Promise<any> => {
    return await getSequelize().query(`
        SELECT u.*,
               g.discount_ids,
               g.to_be_reached,
               g.description,
               (SELECT count(*)
                FROM trips t
                WHERE t.user_id = :user_id
                  AND t.created_at > u.started_at
                  AND t.duration > 3
                  AND t.user_subscription_id IS NULL
                  AND t.status = 'PAYMENT_SUCCESS')::int AS total_trips
        FROM user_games u
                 LEFT JOIN games g
                           ON g.id = u.game_id
        WHERE u.status = 'ACTIVE'
          AND u.user_id = :user_id
    `, {
        replacements: {
            user_id: userId
        },
        raw: true,
        plain: true,
        transaction: transaction,
        type: QueryTypes.SELECT
    });
};
