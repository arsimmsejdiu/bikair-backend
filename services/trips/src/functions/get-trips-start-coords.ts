import { getTripsStartCoords } from "../services/getTripsStartCoords";
import { GetTripsStartCoordsInput,GetTripsStartCoordsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripsStartCoordsInput, GetTripsStartCoordsOutput>(async request => {
    return await getTripsStartCoords();
});
