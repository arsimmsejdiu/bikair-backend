import { getAdmin } from "../services/getAdmin";
import { GetAdminInput, GetAdminOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetAdminInput, GetAdminOutput>(async request => {
    const adminId = Number(request.pathParams?.admin_id);

    if (Number.isNaN(adminId)) {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await getAdmin(adminId);
});
