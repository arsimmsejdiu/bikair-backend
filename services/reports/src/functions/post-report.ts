import { createReport } from "../services/createReport";
import { HandlerWithTokenAuthorizerBuilder, PostReportInput,PostReportOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostReportInput, PostReportOutput>(async request => {
    const userId = request.userId;
    const body = request.body;

    if (Number.isNaN(userId) || !body) {
        return {
            statusCode: 400,
            result: "MISSING_PARAMS"
        };
    }

    return await createReport(userId, body);
});
