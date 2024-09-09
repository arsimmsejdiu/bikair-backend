import { PutMarketings } from "../dao/PutMarketings";
import { mergeTranslations } from "./utils";
import { PutMarketingsInput } from "@bikairproject/lib-manager";
import { createMarketingSelector } from "@bikairproject/marketing-engine";

export const putMarketings = async (body: PutMarketingsInput) => {
    try {
        if (body.configuration) {
            const selectUserQuery = createMarketingSelector(body.configuration);
            body.request = selectUserQuery.sql;
            body.replacements = selectUserQuery.replacements;
        }

        body = mergeTranslations(body);

        const result = await PutMarketings(body);

        return {
            statusCode: 204,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] putMarketings : ");
        throw error;
    }
};
