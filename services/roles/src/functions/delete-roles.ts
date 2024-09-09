import { deleteRoles } from "../services/deleteRoles";
import {DeleteRolesInput,DeleteRolesOutput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<DeleteRolesInput, DeleteRolesOutput>(async request => {
    const id = Number(request.pathParams?.role_id);
    if (Number.isNaN(id)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await deleteRoles(id);
});
