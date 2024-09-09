import {APIGatewayProxyEventV2, Context} from "aws-lambda";
import {sign} from "jsonwebtoken";

import {ACCESS_JWT_LIMIT_ADMIN, JWT_SECRET, MICROSERVICE_NOTIFICATION} from "../config/config";
import {invokeAsync} from "@bikairproject/aws/dist/lib";
import {closeConnection, ErrorUtils, ExternalAccountsModel, loadSequelize,verifyPassword} from "@bikairproject/lib-manager";


const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};

export const handler = async (event: APIGatewayProxyEventV2, context: Context) => {
    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;
        const body = JSON.parse(event.body ?? "{}");

        if (!body.username || !body.password) {
            console.log("Missing body parameters");
            // Ensure you are closing the connexion
            await closeConnection();
            const message = await ErrorUtils.getMessage("MISSING_PARAMS");
            return {
                statusCode: 409,
                headers: headers,
                body: JSON.stringify({
                    message: message
                })
            };
        }

        const account = await ExternalAccountsModel.findOne({
            where: {
                login: body.username
            }
        });
        if (!account) {
            console.log(`Account with login ${body.username} not found`);
            // Ensure you are closing the connexion
            await closeConnection();
            return {
                statusCode: 404,
                headers: headers,
                body: "Not Found"
            };
        } else {
            console.log(account);
        }

        const validatePw = await verifyPassword(body.password, account.password);
        if (!validatePw) {
            console.log("Password missmatch !");
            // Ensure you are closing the connexion
            await closeConnection();
            return {
                statusCode: 404,
                headers: headers,
                body: "Not Found"
            };
        } else {
            console.log("passowrd ok");
        }

        // Generate temporary JWT
        const token = sign({
            userId: account.uuid,
            role: account.company,
            name: (account.name ?? "").toLowerCase().trim(),
            email: (account.email ?? "").toLowerCase().trim()
        },
        JWT_SECRET ?? "",
        {
            expiresIn: ACCESS_JWT_LIMIT_ADMIN
        });

        console.log("token signed");
        // Ensure you are closing the connexion
        await closeConnection();
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                bearerToken: token
            })
        };
    } catch (error) {
        if(MICROSERVICE_NOTIFICATION) {
            const from = "POST /auth/login";
            const payload = await ErrorUtils.getSlackErrorPayload(from, error);
            await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
        }

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
