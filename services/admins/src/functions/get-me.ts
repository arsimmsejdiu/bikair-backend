import { getMe } from "../services/getMe";
import { GetAdminMeInput, GetAdminMeOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetAdminMeInput, GetAdminMeOutput>(async request => {
    const adminId = Number(request.userId);

    if (Number.isNaN(adminId)) {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await getMe(adminId);
});
