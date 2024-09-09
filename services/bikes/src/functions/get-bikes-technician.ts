import {getBikesTechnician} from "../services/getBikesTechnician";
import {GetBikesTechnicianInput, GetBikesTechnicianOutput, HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetBikesTechnicianInput, GetBikesTechnicianOutput>(async request => {
    const userId = request.userId;
    const lastUpdate = request.queryString?.lastUpdate ? Number(request.queryString?.lastUpdate) : null;

    if (Number.isNaN(userId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getBikesTechnician(userId, lastUpdate);
});
