import { createPreSignedUrl } from "../services/createPreSignedUrl";
import { HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lambda-framework";
import { PreSignedUrlInput, PreSignedUrlOutput } from "@bikairproject/shared";

export const handler = HandlerWithTokenAuthorizerBuilder<PreSignedUrlInput, PreSignedUrlOutput>(async request => {
    const body = request.body;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createPreSignedUrl(body);
});
