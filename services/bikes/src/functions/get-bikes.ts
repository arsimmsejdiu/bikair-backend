import {getBikes} from "../services/getBikes";
import {GetBikesInput, GetBikesOutput, HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikesInput, GetBikesOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getBikes(query);
});
