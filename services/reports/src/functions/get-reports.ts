import { getReports } from "../services/getReports";
import { GetReportsInput,GetReportsOutput,HandlerWithTokenAuthorizerBuilder } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetReportsInput, GetReportsOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getReports(query);
});
