import {APIGatewayProxyEvent, APIGatewayProxyEventV2, Context} from "aws-lambda";
import {sign, verify} from "jsonwebtoken";

import {ACCESS_JWT_LIMIT_CLIENT, JWT_SECRET, JWT_SECRET_TMP, MICROSERVICE_NOTIFICATION} from "../config/config";
import httpResponses from "../services/httpResponses";
import {validatePhone} from "../services/usersServices";
import {invokeAsync} from "@bikairproject/aws/dist/lib";
import {
    closeConnection,
    ErrorUtils,
    loadSequelize,
    SessionsModel,
    TranslateUtils,
    UsersModel
} from "@bikairproject/lib-manager";

export const handler = async (event: APIGatewayProxyEventV2 | APIGatewayProxyEvent, context: Context) => {
    const locale = event.headers["x-locale"] ?? "fr";
    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const body = JSON.parse(event.body ?? "{}");

        if (!body.accessToken) {
            console.log("Missing accessToken");
            // Ensure you are closing the connexion
            throw new Error("MANDATORY_FIELD_TOKEN");
        }

        if (!body.otp) {
            console.log("Missing otp");
            // Ensure you are closing the connexion
            throw new Error("MANDATORY_FIELD_OTP");
        }

        // Validate JWT
        const verifiedToken = verify(body.accessToken, JWT_SECRET_TMP ?? "");
        if (typeof verifiedToken !== "string" && verifiedToken.error) {
            console.log("Error with jwt. Unreconized.");
            // Ensure you are closing the connexion
            throw new Error("UNRECONIZED_TOKEN");
        }

        if (typeof verifiedToken !== "string" && !verifiedToken.phone) {
            console.log("Error with jwt. Missing information.");
            // Ensure you are closing the connexion
            throw new Error("UNRECONIZED_TOKEN");
        }
        const phone = typeof verifiedToken !== "string" ? verifiedToken.phone : null;

        // Find user with token And OTP
        const user = await validatePhone(phone, body.otp);
        if (!user) {
            console.log(`No user found with otp ${body.otp} and phone ${phone}`);
            // Ensure you are closing the connexion
            throw new Error("ERROR_OTP");
        }

        // Generate JWT
        const token = sign(
            {
                userId: user.id,
                role: "USER",
                name: `${user.lastname} ${user.firstname}`.toLowerCase().trim(),
                email: user.email ? user.email.toLowerCase().trim() : ""
            },
            JWT_SECRET ?? "",
            {
                expiresIn: ACCESS_JWT_LIMIT_CLIENT
            }
        );

        const appVersion = event.headers["x-app-version"] ?? event.headers["X-App-Version"];
        const origin = event.headers["x-origin"] ?? event.headers["X-Origin"];
        const device = event.headers["x-device"] ?? event.headers["X-Device"];

        //TODO This exist only during the transition between AWS REST API and AWS HTTP API.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const sourceIp = event.requestContext.identity?.sourceIp ?? event.requestContext.http?.sourceIp;

        // Create a new sessions
        const session = await SessionsModel.create({
            user_uuid: user.uuid,
            valid: "365d",
            ip: sourceIp,
            device: appVersion,
            app_version: origin,
            origin: device
        });

        if (
            phone === "0600000000" ||
            phone === "+33600000000" ||
            phone === "0611111111" ||
            phone === "+33611111111"
        ) {
            await UsersModel.update({client_version: appVersion}, {where: {id: user.id}});
        } else {
            await UsersModel.update({client_version: appVersion, otp: null}, {where: {id: user.id}});

        }

        return httpResponses.ok({
            bearerToken: token,
            refreshToken: session?.refresh_token
        });
    } catch (error) {
        const i18n = new TranslateUtils(locale ?? "fr");
        await i18n.init();
        const message = i18n.t(ErrorUtils.getMessage(error));
        const from = "POST /auth/confirm";
        const payload = ErrorUtils.getSlackErrorPayload(from, message);
        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json"
        };

        // Return correct error message
        switch (error.message) {
            case "MANDATORY_FIELD_OTP":
                return httpResponses.mandatoryField({
                    message: "MANDATORY_FIELD_OTP"
                });
            case "MANDATORY_FIELD_TOKEN":
                return httpResponses.mandatoryField({
                    message: "MANDATORY_FIELD_TOKEN"
                });
            case "UNRECONIZED_TOKEN":
                return httpResponses.tokenError({
                    message: "UNRECONIZED_TOKEN"
                });
            case "ERROR_OTP":
                return httpResponses.notFound({
                    message: "ERROR_OTP"
                });
            default:
                return {
                    statusCode: 500,
                    headers: headers,
                    body: ErrorUtils.getMessage(error)
                };
        }
    } finally {
        // Ensure you are closing the connexion
        await closeConnection();
    }
};

