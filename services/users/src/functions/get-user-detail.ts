import {getUserDetail} from "../services/getUserDetail";
import {GetUserDetailInput,GetUserDetailOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetUserDetailInput, GetUserDetailOutput>(async request => {
    const userId = Number(request.pathParams?.user_id);
    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }
    return await getUserDetail(userId);
});
