import {getUserEventLogs} from "../services/getUserEventLogs";
import {GetUserEventLogsInput,GetUserEventLogsOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserEventLogsInput, GetUserEventLogsOutput>(async request => {
    const userId = Number(request.pathParams?.user_id);
    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    return await getUserEventLogs(userId);
});
