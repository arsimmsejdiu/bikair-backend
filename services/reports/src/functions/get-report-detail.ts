import { getReportDetails } from "../services/getReportDetails";
import { GetReportDetailInput, GetReportDetailOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetReportDetailInput, GetReportDetailOutput>(async request => {
    const bikeId = Number(request.event.pathParameters?.bike_id);

    if (Number.isNaN(bikeId)) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await getReportDetails(bikeId);
});
