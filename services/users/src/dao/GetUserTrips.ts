import { QueryTypes } from "sequelize";

import { getSequelize } from "@bikairproject/lib-manager";
import { GetUserTripsOutputData } from "@bikairproject/lib-manager";

export const GetUserTrips = async (userId: number) => {
    return await getSequelize().query<GetUserTripsOutputData>(`
        SELECT t.uuid,
               t.start_address,
               t.end_address,
               t.time_start,
               t.time_end, 
               t.reference,
               t.status,
               t.price,
               t.created_at,
               t.duration,
               t.refund_amount,
               t.discounted_amount,
               p.last_4,
               coalesce(d.code, s.name, case when r.id is not null then 'RENTAL' end) as code,
               coalesce(d.type, s.discount_type, case when r.id is not null then 'PERCENT' end) as type,
               coalesce(d.value, s.discount_value, case when r.id is not null then 100 end) as type,
               b.name as bike_name
        FROM trips t
                 LEFT JOIN payment_methods p
                           ON p.id = t.payment_method_id
                 LEFT JOIN discounts d
                           ON d.id = t.discount_id
                 LEFT JOIN user_subscriptions s
                           ON s.id = t.user_subscription_id
                 LEFT JOIN rentals r
                           ON r.id = t.rental_id
                 LEFT JOIN bikes b
                           ON b.id = t.bike_id
        WHERE t.user_id = :userId
        ORDER BY t.id DESC
    `, {
        replacements: {
            userId: userId
        },
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });
};
