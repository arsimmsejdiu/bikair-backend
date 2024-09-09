import createEvents from "../services/createEvents";
import {HandlerWithoutTokenAuthorizerBuilder,PostCreateEventsInput, PostCreateEventsOutput} from "@bikairproject/lib-manager";

export const handler = HandlerWithoutTokenAuthorizerBuilder<PostCreateEventsInput, PostCreateEventsOutput>(async request => {
    const body = request.body;
    const locale = request.locale;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createEvents(body, locale);
});
