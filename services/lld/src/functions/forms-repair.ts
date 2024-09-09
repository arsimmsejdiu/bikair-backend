import {
    HandlerWithoutTokenAuthorizerBuilder,
    PostFormsRepairInput,
    PostFormsRepairOutput
} from "@bikairproject/lib-manager";

export const handler = HandlerWithoutTokenAuthorizerBuilder<PostFormsRepairInput, PostFormsRepairOutput>(async request => {
    return {
        statusCode: 200,
        result: "Ok"
    };
});
