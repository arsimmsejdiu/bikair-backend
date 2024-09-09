import getEvents from "../services/getEvents";
import { GetEventsInput,GetEventsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetEventsInput, GetEventsOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getEvents(query);
});
