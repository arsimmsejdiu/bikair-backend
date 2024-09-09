import { getRates } from "../services/getRates";
import { GetRatesInput,GetRatesOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetRatesInput, GetRatesOutput>(async request => {
    return await getRates();
});
