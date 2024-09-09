import {
    HandlerWithoutTokenAuthorizerBuilder,
    PostFormsBookingInput,
    PostFormsBookingOutput
} from "@bikairproject/lib-manager";

export const handler = HandlerWithoutTokenAuthorizerBuilder<PostFormsBookingInput, PostFormsBookingOutput>(async request => {
    return {
        statusCode: 200,
        result: "Ok"
    };
});
