import {APIGatewayEvent, Context} from "aws-lambda";

import {PutTopics} from "../dao/PutTopics";
import {closeConnection, loadSequelize} from "@bikairproject/lib-manager";

/** @deprecated in favor of put-user-setting in services/users*/
/**
 * This will update topics for a specific user
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns
 */
export const handler = async (event: APIGatewayEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const userId = event.requestContext.authorizer?.userId;
    const topics = JSON.parse(event.body ?? "{}");

    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const {statusCode, result} = await PutTopics(topics, userId);

        // Ensure you are closing the connexion
        await closeConnection();
        return {
            statusCode: statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.log("[ERROR]", error);
        // Ensure you are closing the connexion
        await closeConnection();
        return {
            statusCode: 500,
            result: error
        };
    }
};
