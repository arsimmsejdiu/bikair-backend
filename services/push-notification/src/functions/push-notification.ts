import {APIGatewayEvent, Context} from "aws-lambda";

import { PushNotification } from "../dao/PushNotification";
import {closeConnection,loadSequelize} from "@bikairproject/lib-manager";


const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json"
};

/**
 * This will update device token for a specific user,
 * this is need to send firebase-message to specific user
 * @param {*} event
 * @param {*} context
 * @returns
 */
export const handler = async (event: APIGatewayEvent, context: Context) => {
    const data = JSON.parse(event.body ?? "{}");
    context.callbackWaitsForEmptyEventLoop = false;

    if(!data.title || !data.topic || !data.message || !data.role){
        return {
            statusCode: 404,
            headers: headers,
            body: "Missing parameters"
        };
    }else{
        try {
            await loadSequelize();
            const {statusCode, result} = await PushNotification(data);

            // Ensure you are closing the connexion
            await closeConnection();
            return {
                statusCode: statusCode,
                headers: headers,
                body: JSON.stringify(result),
            };
        } catch (error) {
            console.log("[ERROR]", error);
            // Ensure you are closing the connexion
            await closeConnection();
            return {
                statusCode: 500,
                headers: headers,
                result: error
            };
        }
    }
};
