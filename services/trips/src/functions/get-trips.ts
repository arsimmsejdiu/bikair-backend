import { getTrips } from "../services/getTrips";
import { GetTripsInput,GetTripsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripsInput, GetTripsOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getTrips(query);
});
