import { getTripDetails } from "../services/getTripDetails";
import { GetTripDetailsInput, GetTripDetailsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripDetailsInput, GetTripDetailsOutput>(async request => {
    const id = Number(request.pathParams?.id) ?? null;
    if (!id) {
        return {
            statusCode: 400,
            result: "Malformed request"
        };
    }
    return await getTripDetails(id);
});
