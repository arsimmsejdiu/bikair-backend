import {getCities} from "../services/getCities";
import {GetCitiesInput, GetCitiesOutput,HandlerWithoutTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithoutTokenAuthorizerBuilder<GetCitiesInput, GetCitiesOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getCities(query);
});
