import { getReportHistory } from "../services/getReportHistory";
import { GetReportHistoryInput,GetReportHistoryOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetReportHistoryInput, GetReportHistoryOutput>(async request => {
    const bikeId = Number(request.event.pathParameters?.bike_id);

    if (Number.isNaN(bikeId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getReportHistory(bikeId);
});
