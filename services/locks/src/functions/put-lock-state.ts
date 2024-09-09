import putLockState from "../services/putLockState";
import { HandlerWithTokenAuthorizerBuilder, PutLockStateInput, PutLockStateOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PutLockStateInput, PutLockStateOutput>(async request => {
    const body = request.body;
    const locale = request.locale;

    if (!body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await putLockState(body, locale);
});
