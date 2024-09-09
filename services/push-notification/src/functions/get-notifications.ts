import {APIGatewayEvent, Context} from "aws-lambda";

import { GetNotifications } from "../dao/GetNotifications";
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
    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const {statusCode, result} = await GetNotifications(event.queryStringParameters);

        // Ensure you are closing the connexion
        await closeConnection();
        return {
            statusCode: statusCode,
            headers: headers,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.log("[ERROR]", error);
        // Ensure you are closing the connexion
        await closeConnection();
        return {
            statusCode: 500,
            headers:headers,
            result: error
        };
    }
};
