import {APIGatewayRequestAuthorizerEvent, APIGatewayRequestAuthorizerEventV2} from "aws-lambda";

import {JWT_SECRET} from "../config/config";
import {generateIAMPolicy, verifyApiKey, verifyToken} from "@bikairproject/security";
import {APP_ORIGINS} from "@bikairproject/shared";

export const handler = async (event: APIGatewayRequestAuthorizerEventV2 | APIGatewayRequestAuthorizerEvent) => {

    console.log("-----------AUTHORIZER-v2---------------");

    // 1. Verify apikey
    let apiKey;
    let origin;
    if (event.headers) {
        apiKey = event.headers["x-api-key"] ?? event.headers["X-Api-Key"];
        origin = event.headers["x-origin"] ?? event.headers["X-Origin"];
    }
    //TODO This exist only during the transition between AWS REST API and AWS HTTP API.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const arn = event.routeArn ?? event.methodArn;
    console.log("Method ARN: " + arn);

    if (typeof apiKey === "undefined"
        || apiKey === null
        || typeof origin === "undefined"
        || origin === null
        || origin !== APP_ORIGINS.MOBILE_APP) {
        return generateIAMPolicy(null, "Deny", arn, null);
    }

    const isValidKey = await verifyApiKey(apiKey, origin);
    if (isValidKey.type === "deny") {
        return generateIAMPolicy(null, "Deny", arn, null);
    }

    // 2. Get AccessToken
    if (!event.headers || !event.headers.authorization || !event.headers.authorization.includes("Bearer")) {
        return generateIAMPolicy(null, "Deny", arn, null);
    }

    const bearerToken = event.headers.authorization.split(" ")[1];

    // 3. Verify accessToken
    const verifiedToken = verifyToken(bearerToken, JWT_SECRET);
    switch (verifiedToken.type) {
        case "allow":
            console.log("allow");
            return generateIAMPolicy(verifiedToken.userId, "Allow", arn, verifiedToken.role);
        case "deny":
            console.log("deny");
            return generateIAMPolicy(null, "Deny", arn, null);
        case "unauthorized":
            console.log("unauthorized");
            throw "Unauthorized";   // Return a 401 Unauthorized response
        default:
            console.log("invalid");
            return "Error: Invalid token"; // Return a 500 Invalid token response
    }
};
