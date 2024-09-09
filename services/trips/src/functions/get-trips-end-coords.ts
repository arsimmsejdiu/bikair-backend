import { getTripsEndCoords } from "../services/getTripsEndCoords";
import { GetTripsEndCoordsInput,GetTripsEndCoordsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetTripsEndCoordsInput, GetTripsEndCoordsOutput>(async request => {
    return await getTripsEndCoords();
});
