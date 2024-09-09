import {QueryTypes} from "sequelize";

import {getSequelize, GetUserEventLogsOutputData} from "@bikairproject/lib-manager";

export const GetUserEventLogs = async (userId: number) => {
    return await getSequelize().query<GetUserEventLogsOutputData>(`
            select e.date,
                e.type,
                e.version,
                e.brand,
                e.bluetooth,
                e.camera,
                e.location,
                e.created_at as received_date,
                e.metadata
            from users u
                left join event_log e
                            on u.id = e.user_id::integer
                                or u.phone = e.user_phone
                                OR ('0' || substring(u.phone, 4)) = e.user_phone
            where u.id = :userId
            order by e.date desc
    `, {
        replacements: {
            userId: userId
        },
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });
};



// SELECT to_timestamp(cast(e.metadata ->> 'date' AS DOUBLE PRECISION) / 1000) AS date,
//                e.type,
//                e.metadata,
//                e.created_at                                                         AS reception
//         FROM users u
//                  LEFT JOIN event_log e
//                            ON u.id = cast(metadata ->> 'userId' AS INTEGER)
//                                OR u.phone = metadata -> 'user' ->> 'phone'
//                                OR u.phone = metadata ->> 'phone'
//                                OR ('0' || substring(u.phone, 4)) = metadata ->> 'phone'
//         WHERE u.id = :userId
//         ORDER BY to_timestamp(cast(e.metadata ->> 'date' AS DOUBLE PRECISION) / 1000) DESC
