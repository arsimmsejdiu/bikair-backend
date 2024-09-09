import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

import { GetSpotsNearby } from "../dao/GetSpotsNearby";
import { closeConnection } from "@bikairproject/lib-manager";

export const getSpotsNearBy = async (query: APIGatewayProxyEventQueryStringParameters | null, origin: string) => {
    try {
        const result = await GetSpotsNearby(query, origin);

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] query : ", query);
        throw error;
    }finally{
        await closeConnection();
    }
};
