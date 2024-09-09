import {APIGatewayProxyEvent, APIGatewayProxyEventV2, Context} from "aws-lambda";
import {sign} from "jsonwebtoken";

import {ACCESS_JWT_LIMIT_ADMIN, JWT_SECRET, MICROSERVICE_NOTIFICATION} from "../config/config";
import {createAdmin} from "../services/adminsServices";
import httpResponses from "../services/httpResponses";
import {invokeAsync} from "@bikairproject/aws/dist/lib";
import {
    closeConnection,
    ErrorUtils,
    getAdminMe,
    hashPassword,
    loadSequelize,
    TranslateUtils
} from "@bikairproject/lib-manager";

export const handler = async (event: APIGatewayProxyEventV2 | APIGatewayProxyEvent, context: Context) => {
    const locale = event.headers["x-locale"] ?? "fr";
    try {
        await loadSequelize();
        const body = JSON.parse(event.body ?? "{}");

        if (!body.lastname || !body.firstname || !body.password || !body.username || !body.roles || !body.email) {
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.mandatoryField({
                message: "MISSING_PARAMS"
            });
        }
        if (body.roles && body.roles.length === 0) {
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.mandatoryField({
                message: "MISSING_PARAMS"
            });
        }

        body.hash = await hashPassword(body.password);

        const {email, username, lastname, firstname, phone, hash, role_id} = body;
        const admin = await createAdmin(email, username, lastname, firstname, phone, hash, role_id);

        if (admin === null) {
            return httpResponses.serverError();
        }

        const me = await getAdminMe(admin.id);

        // Generate temporary JWT
        const token = sign(
            {
                userId: admin.id,
                role: me?.roles
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
        const from = "POST /auth/register";
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
