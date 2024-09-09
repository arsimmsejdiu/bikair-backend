import {APIGatewayProxyEvent, APIGatewayProxyEventV2WithLambdaAuthorizer, Context} from "aws-lambda";
import {sign} from "jsonwebtoken";

import {ACCESS_JWT_LIMIT_ADMIN, JWT_SECRET_ADMIN, MICROSERVICE_NOTIFICATION} from "../config/config";
import httpResponses from "../services/httpResponses";
import {invokeAsync} from "@bikairproject/aws/dist/lib";
import {
    AdminsModel,
    BikairAuthorizerContext,
    closeConnection,
    ErrorUtils,
    loadSequelize,
    RolesModel,
    TranslateUtils,
    verifyPassword
} from "@bikairproject/lib-manager";


export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<BikairAuthorizerContext> | APIGatewayProxyEvent, context: Context) => {
    console.log("Start login auth");
    const locale = event.headers["x-locale"] ?? "fr";
    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const body = JSON.parse(event.body ?? "{}");

        if (!body.username || !body.password) {
            console.log("Missing body parameters");
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.mandatoryField({
                message: "MISSING_PARAMS"
            });
        }

        const admin = await AdminsModel.findOne({
            where: {
                username: String(body.username ?? "").toUpperCase()
            }
        });
        if (!admin) {
            console.log(`User ${body.username} not found`);
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.notFound({
                message: "No user found !"
            });
        } else {
            console.log(admin);
        }

        const validatePw = await verifyPassword(body.password, admin.password);
        if (!validatePw) {
            console.log("Password mismatch !");
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.tokenError({
                message: "Not authorized !"
            });
        } else {
            console.log("password ok");
        }

        const role = await RolesModel.findByPk(admin.role_id);
        if (!role) {
            console.log(`User ${body.username}, role not found`);
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.notFound({
                message: "No user found !"
            });
        } else {
            console.log(role);
        }

        // Generate temporary JWT
        const token = sign({
            userId: admin.id,
            role: role.name,
            name: `${admin.lastname} ${admin.firstname}`.toLowerCase().trim(),
            email: admin.email ? admin.email.toLowerCase().trim() : ""
        },
        JWT_SECRET_ADMIN ?? "",
        {
            expiresIn: ACCESS_JWT_LIMIT_ADMIN
        });

        console.log("token signed");
        // Ensure you are closing the connexion
        await closeConnection();
        return httpResponses.ok({
            bearerToken: token
        });
    } catch (error) {
        const i18n = new TranslateUtils(locale ?? "fr");
        await i18n.init();
        const message = i18n.t(ErrorUtils.getMessage(error));
        const from = "POST /auth/login";
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
