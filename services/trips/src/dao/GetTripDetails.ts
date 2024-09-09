import {QueryTypes} from "sequelize";

import {getSequelize,GetTripDetailsOutput} from "@bikairproject/lib-manager";

export const GetTripDetails = async (tripId: number) => {
    return await getSequelize().query<GetTripDetailsOutput>(`
        SELECT t.id,
               b.name                            AS bike_name,
               u.firstname || ' ' || u.lastname  AS user_name,
               t.user_id,
               t.city_id,
               c.name                            AS city_name,
               t.price,
               t.discounted_amount,
               d.code                            AS discount_code,
               t.duration,
               t.status,
               t.refund_amount,
               t.payment_intent,
               TO_TIMESTAMP(t.time_start / 1000) AS time_start,
               t.start_coords,
               t.end_photo,
               t.validation_photo,
               TO_TIMESTAMP(t.time_end / 1000)   AS time_end,
               t.end_coords
        FROM trips t
                 LEFT JOIN bikes b
                           ON b.id = t.bike_id
                 LEFT JOIN users u
                           ON u.id = t.user_id
                 LEFT JOIN cities c
                           ON c.id = t.city_id
                 LEFT JOIN discounts d
                           ON d.id = t.discount_id
        WHERE t.id = :tripId
    `, {
        replacements: {
            tripId: tripId
        },
        raw: false,
        plain: true,
        type: QueryTypes.SELECT
    });
};
