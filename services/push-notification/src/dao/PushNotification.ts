import {QueryTypes} from "sequelize";

import {saveMessage} from "../services/saveMessage";
import { SendMessage } from "@bikairproject/fcm";
import {getSequelize} from "@bikairproject/lib-manager";


/**
 *
 * @param {*} data Object
 * @returns
 */
export const PushNotification = async (data) => {
    // Get device token list
    // List can be a selection of userID based on topic subscription
    let query;
    switch (data.role) {
        case "USER":
            query = "SELECT ARRAY(SELECT device_token FROM user_settings WHERE $1 = ANY(topics) ) AS tokens";
            break;
        case "ADMIN":
            query = "SELECT ARRAY(SELECT device_token FROM admins WHERE $1 = ANY(topics) ) AS tokens";
            break;
        default:
            return {
                statusCode: 400,
                result: "Vous devez definir le type d'utilisateur ADMIN ou USER"
            };
    }
    try{
        let res = "Aucun utilisateur trouvé !";
        const response = await getSequelize().query<{tokens: string[]}>(query, {
            bind: [data.topic],
            raw: true,
            plain: true,
            type: QueryTypes.SELECT
        });

        if(response?.tokens && response?.tokens.length > 0){
            // Send message with firebase-admin
            const msg = await SendMessage(response.tokens, data.title, data.message, undefined, undefined, data.save);
            if(!msg) {
                throw new Error("Message not send");
            }

            // Save message to DB
            const storeMessage = await saveMessage(data);
            if(!storeMessage) {
                throw new Error("Message could not be stored");
            }

            res = "Push notification envoyé !";
        }
        return {
            statusCode: 200,
            result: res
        };
    }catch(err){
        console.log("[ERROR]", err);
        return {
            statusCode: 400,
            result: err
        };
    }
};
