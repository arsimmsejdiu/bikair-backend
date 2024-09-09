import { MICROSERVICE_NOTIFICATION } from "../config/config";
import { createSupportTicket } from "../services/createSupportTicket";
import { invokeAsync } from "@bikairproject/lambda-utils";
import { closeConnection, loadSequelize } from "@bikairproject/lib-manager";
import { ErrorUtils } from "@bikairproject/lib-manager";


export const handler = async (event: any, context: any) => {
    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const userId = Number(event.requestContext.authorizer?.userId);
        const body = JSON.parse(event.body ?? "{}");

        if (Number.isNaN(userId)) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                    "Content-Type": "application/json"
                },
                body: "MISSING_PARAMS"
            };
        }

        const { statusCode } = await createSupportTicket(userId, body);

        return {
            statusCode: statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json"
            }
        };
    } catch (error) {
        console.log(error);
        const message = await ErrorUtils.getMessage(error);
        if (MICROSERVICE_NOTIFICATION) {
            const from = "PUT /users/settings";
            const payload = await ErrorUtils.getSlackErrorPayload(from, error);
            await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
        }

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json"
            },
            body: message
        };
    } finally {
        // Ensure you are closing the connexion
        await closeConnection();
    }
};
