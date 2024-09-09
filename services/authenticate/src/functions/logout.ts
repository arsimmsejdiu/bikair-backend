import {APIGatewayProxyEvent, APIGatewayProxyEventV2, Context} from "aws-lambda";

import {MICROSERVICE_NOTIFICATION} from "../config/config";
import httpResponses from "../services/httpResponses";
import {invokeAsync} from "@bikairproject/aws/dist/lib";
import {closeConnection, closeSession, ErrorUtils, loadSequelize, TranslateUtils} from "@bikairproject/lib-manager";

export const handler = async (event: APIGatewayProxyEventV2 | APIGatewayProxyEvent, context: Context) => {
    const locale = event.headers["x-locale"] ?? "fr";
    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const body = JSON.parse(event.body ?? "{}");

        await closeSession(body.refresh_token);

        // Ensure you are closing the connexion
        await closeConnection();
        return httpResponses.ok();
    } catch (error) {
        const i18n = new TranslateUtils(locale ?? "fr");
        await i18n.init();
        const message = i18n.t(ErrorUtils.getMessage(error));
        const from = "POST /auth/logout";
        const payload = ErrorUtils.getSlackErrorPayload(from, message);
        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);

        // Ensure you are closing the connexion
        await closeConnection();
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json"
            },
            body: ErrorUtils.getMessage(error)
        };
    }
};
