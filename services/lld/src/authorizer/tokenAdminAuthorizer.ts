import {APIGatewayRequestAuthorizerEventV2} from "aws-lambda";

import {generatePolicy} from "@bikairproject/lib-manager";

export const handler = async (event: APIGatewayRequestAuthorizerEventV2) => {
    console.log("-----------AUTHORIZER---------------");
    return generatePolicy(true, null);
};
