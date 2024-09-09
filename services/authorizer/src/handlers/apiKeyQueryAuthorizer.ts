import {APIGatewayRequestAuthorizerEvent, APIGatewayRequestAuthorizerEventV2} from "aws-lambda";

import {closeConnection, loadSequelize} from "@bikairproject/database";
import {AuthorizerResponse, generatePolicy, verifyApiKey} from "@bikairproject/security";

export const handler = async (event: APIGatewayRequestAuthorizerEventV2 | APIGatewayRequestAuthorizerEvent) => {
    console.log("Method type: " + event.type);

    try {
        await loadSequelize();
        let apiKey;
        let origin;
        if (event.queryStringParameters) {
            apiKey = event.queryStringParameters["api_key"];
            origin = "WEB_HOOK";
        }

        if (typeof apiKey === "undefined"
            || apiKey === null
            || typeof origin === "undefined"
            || origin === null) {
            return generatePolicy(false, null);
        }

        const isValidKey = await verifyApiKey(apiKey, origin);
        console.log("Close connection");
        let policy: AuthorizerResponse;
        if (isValidKey.type === "deny") {
            policy = generatePolicy(false, null);
        } else {
            policy = generatePolicy(true, null);
        }
        console.log(policy);
        return policy;
    } catch (error) {
        console.log(error);
        console.log("Close connection");
        return generatePolicy(false, null);
    }finally{
        await closeConnection();
    }
};
