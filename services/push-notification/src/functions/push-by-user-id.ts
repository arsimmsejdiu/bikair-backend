import {APIGatewayEvent, Context} from "aws-lambda";

import { PushByUserDevice } from "../dao/PushByUserDevice";
import {closeConnection,loadSequelize} from "@bikairproject/lib-manager";


const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json"
};

/**
 * This will send a push-notification by user device_token
 * @param {*} event
 * @param {*} context
 * @returns
 */
export const handler = async (event: APIGatewayEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const data = event.body ? JSON.parse(event.body) : event;
    console.log("-----[DATA]---++++++++++++", data);
    // eslint-disable-next-line no-case-declarations
    if(!data.title || !data.topic || !data.message || !data.role || !data.user_ids){
        return {
            statusCode: 400,
            headers: headers,
            body: "Missing parameters"
        };
    }

    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const {statusCode, result} = await PushByUserDevice(data);

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
            headers: headers,
            result: error
        };
    }
};
