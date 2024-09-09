import {APIGatewayRequestAuthorizerEvent, APIGatewayRequestAuthorizerEventV2} from "aws-lambda";
import {APIGatewayAuthorizerResult} from "aws-lambda/trigger/api-gateway-authorizer";

import {closeConnection, loadSequelize} from "@bikairproject/database";
import {generateIAMPolicy, verifyApiKey} from "@bikairproject/security";

export const handler = async (event: APIGatewayRequestAuthorizerEventV2 | APIGatewayRequestAuthorizerEvent) => {
    //TODO This exist only during the transition between AWS REST API and AWS HTTP API.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const arn = event.routeArn ?? event.methodArn;
    console.log("Method ARN: " + arn);
    console.log("Method type: " + event.type);
    try {
        await loadSequelize();
        let apiKey;
        let origin;
        if (event.headers) {
            apiKey = event.headers["x-api-key"] ?? event.headers["X-Api-Key"];
            origin = event.headers["x-origin"] ?? event.headers["X-Origin"];
        }

        if (typeof apiKey === "undefined"
            || apiKey === null
            || typeof origin === "undefined"
            || origin === null) {
            return generateIAMPolicy(null, "Deny", arn, null);
        }


        const isValidKey = await verifyApiKey(apiKey, origin);
        console.log("Close connection");
        await closeConnection();
        let policy: APIGatewayAuthorizerResult;
        if (isValidKey.type === "deny") {
            policy = generateIAMPolicy(null, "Deny", arn, null);
        } else {
            policy = generateIAMPolicy(null, "Allow", arn, null);
        }
        console.log(policy);
        return policy;
    } catch (error) {
        console.log(error);
        console.log("Close connection");
        await closeConnection();
        return generateIAMPolicy(null, "Deny", arn, null);
    }
};
