import { updateTrips } from "../services/updateTrips";
import { HandlerWithTokenAuthorizerBuilder,  PutTripsInput,PutTripsOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutTripsInput, PutTripsOutput>(async request => {
    const body = request.body;
    const locale = request.locale;

    if(!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await updateTrips(body, locale);
});
