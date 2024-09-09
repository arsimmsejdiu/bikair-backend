import {APIGatewayProxyEvent, APIGatewayProxyEventV2, Context} from "aws-lambda";
import {sign} from "jsonwebtoken";

import {ACCESS_JWT_LIMIT_ADMIN, JWT_SECRET, MICROSERVICE_NOTIFICATION} from "../config/config";
import httpResponses from "../services/httpResponses";
import {invokeAsync} from "@bikairproject/aws/dist/lib";
import {closeConnection, ExternalAccountsModel, loadSequelize, TranslateUtils} from "@bikairproject/lib-manager";
import {ErrorUtils, ExternalAccounts, ExternalAccountsCreate,hashPassword} from "@bikairproject/lib-manager";

export const handler = async (event: APIGatewayProxyEventV2 | APIGatewayProxyEvent, context: Context) => {
    const locale = event.headers["x-locale"] ?? "fr";
    try {
        await loadSequelize();
        const body = JSON.parse(event.body ?? "{}") as ExternalAccountsCreate;

        if (!body.company || !body.login || !body.password) {
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.mandatoryField({
                message: "MISSING_PARAMS"
            });
        }

        const hash = await hashPassword(body.password);

        const account: ExternalAccounts = await ExternalAccountsModel.create({
            ...body,
            password: hash
        });

        if (account === null) {
            return httpResponses.serverError();
        }

        // Generate temporary JWT
        const token = sign(
            {
                userId: account.id,
                role: account.company
            },
            JWT_SECRET ?? "",
            {
                expiresIn: ACCESS_JWT_LIMIT_ADMIN
            });

        // Ensure you are closing the connexion
        await closeConnection();
        return httpResponses.ok({
            bearerToken: token
        });
    } catch (error) {
        const i18n = new TranslateUtils(locale ?? "fr");
        await i18n.init();
        const message = i18n.t(ErrorUtils.getMessage(error));
        const from = "POST /auth/register-external";
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
