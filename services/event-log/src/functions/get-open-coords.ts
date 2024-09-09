import getOpenCoords from "../services/getOpenCoords";
import { GetOpenCoordsInput,GetOpenCoordsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetOpenCoordsInput, GetOpenCoordsOutput>(async request => {
    return await getOpenCoords();
});
