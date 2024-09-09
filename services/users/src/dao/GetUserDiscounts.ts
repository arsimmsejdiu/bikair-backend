import { QueryTypes } from "sequelize";

import { getSequelize } from "@bikairproject/lib-manager";
import { GetUserDiscountsData } from "@bikairproject/lib-manager";

export const GetUserDiscounts = async (userId: number) => {
    return await getSequelize().query<GetUserDiscountsData>(`
        SELECT d.code,
               u.user_id,
               u.discount_id,
               d.value,
               d.type,
               d.product_id,
               u.remaining,
               u.id,
               d.reusable,
               d.expired_at
        FROM user_discounts u
                 INNER JOIN discounts d
                            ON d.id = u.discount_id
        WHERE u.user_id = :userId
          AND u.status in ('IN_USE', 'ACTIVE')
          AND (d.expired_at > NOW() OR d.expired_at IS NULL)
          AND u.remaining > 0
          AND u.used = FALSE
        ORDER BY CASE
                     WHEN type = 'PACK' THEN 1
                     END, u.id DESC
    `, {
        replacements: {
            userId: userId
        },
        raw: true,
        plain: false,
        type: QueryTypes.SELECT
    });
};
