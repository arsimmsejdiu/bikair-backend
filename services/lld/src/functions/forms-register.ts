import {
    HandlerWithoutTokenAuthorizerBuilder,
    PostFormsRegisterInput,
    PostFormsRegisterOutput
} from "@bikairproject/lib-manager";

export const handler = HandlerWithoutTokenAuthorizerBuilder<PostFormsRegisterInput, PostFormsRegisterOutput>(async request => {
    return {
        statusCode: 200,
        result: "Ok"
    };
});
