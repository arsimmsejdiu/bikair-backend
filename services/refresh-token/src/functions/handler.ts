import {APIGatewayProxyEventV2, Context} from "aws-lambda";

import {postToken} from "../services/postToken";
import {closeConnection, loadSequelize} from "@bikairproject/lib-manager";

/**
 * This will generate a new bearerToken base on the refresh token
 * @param {*} event
 * @param {*} context
 * @returns
 */
export const handler = async (event: APIGatewayProxyEventV2, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;

        const body = JSON.parse(event.body ?? "{}");
        const {statusCode, result} = await postToken(body);

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
            statusCode: 403,
            result: error
        };
    }
};
