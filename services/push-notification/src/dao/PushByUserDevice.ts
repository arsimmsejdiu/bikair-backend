import { QueryTypes } from "sequelize";

import { SendMessage } from "@bikairproject/fcm";
import { getSequelize } from "@bikairproject/lib-manager";


/**
 * We'll send a notification to a specific users
 * @param {*} data Object
 * @returns
 */
export const PushByUserDevice = async (data) => {
    // Get device token list
    // List can be a selection of userID based on topic subscription
    let query, update;
    switch (data.role) {
        case "SUPPORT":
            query = `SELECT ARRAY(SELECT device_token
                FROM user_settings
                WHERE user_id in (?)
                    and device_token is not null ) AS tokens`;
            break;
        case "USER":
            query = `SELECT ARRAY(SELECT device_token
                            FROM user_settings
                            WHERE user_id in (?)
                            AND ? = ANY (topics)
                            and device_token is not null
                            and (last_notif < (current_timestamp - (20 * interval '1 minute')) or
                                    last_notif is null)) AS tokens`;
            update = `update user_settings
                set last_notif = current_timestamp
                    WHERE user_id in (?)
                    AND ? = ANY (topics)
                    and device_token is not null
                    and (last_notif < (current_timestamp - (20 * interval '1 minute')) or last_notif is null)`;
            break;
        case "ADMIN":
            query = `SELECT ARRAY(SELECT device_token
                                FROM admins
                                WHERE id in (?)
                                and device_token is not null
                                AND ? = ANY (topics)) AS tokens`;
            break;
        default:
            return {
                statusCode: 400,
                result: "Vous devez definir le type d'utilisateur ADMIN ou USER"
            };
    }
    try {
        let res = "Aucun utilisateur trouvé !";
        const response = await getSequelize().query<{ tokens: string[] }>(query, {
            replacements: [data.user_ids, data.topic],
            raw: true,
            plain: true,
            type: QueryTypes.SELECT
        });

        if (response?.tokens && response.tokens.length > 0) {
            // Send message with firebase-admin
            const msg = await SendMessage(response.tokens, data.title, data.message, data.redirectTo, undefined, data.save);
            if (!msg) {
                throw new Error("Message counld not send");
            }

            res = "Push notification envoyé !";
        }

        if (update) {
            await getSequelize().query(update, {
                replacements: [data.user_ids, data.topic],
                raw: true,
                type: QueryTypes.UPDATE
            });
        }

        return {
            statusCode: 200,
            result: res
        };
    } catch (err) {
        console.log("[ERROR]", err);
        return {
            statusCode: 400,
            result: err
        };
    }
};
