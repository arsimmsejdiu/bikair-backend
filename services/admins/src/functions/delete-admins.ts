import { deleteAdmin } from "../services/deleteAdmin";
import { DeleteAdminsInput, DeleteAdminsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<DeleteAdminsInput, DeleteAdminsOutput>(async request => {
    const adminId = Number(request.pathParams?.admin_id);

    if (Number.isNaN(adminId)) {
        return {
            statusCode: 409,
            result: "MISSING_PARAMS"
        };
    }

    return await deleteAdmin(adminId);
});
