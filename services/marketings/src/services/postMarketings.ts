import { NODE_ENV } from "../config/config";
import { PostMarketings } from "../dao/PostMarketings";
import { PutMarketings } from "../dao/PutMarketings";
import { mergeTranslations } from "./utils";
import { createCronEvent } from "@bikairproject/aws/dist/lib";
import { PostMarketingsInput, STATUS } from "@bikairproject/lib-manager";
import { createMarketingSelector } from "@bikairproject/marketing-engine";

export const postMarketings = async (body: PostMarketingsInput) => {
    let marketing;
    try {
        if (body.configuration) {
            const selectUserQuery = createMarketingSelector(body.configuration);
            body.request = selectUserQuery.sql;
            body.replacements = selectUserQuery.replacements;
        } else {
            return {
                statusCode: 400,
                result: "MISSING_PARAMS"
            };
        }
        body = mergeTranslations(body);

        // Create the new marketing campagn
        body.fn_arn = body.fn_arn || `arn:aws:lambda:eu-west-3:962351136828:function:bikair-marketings-${NODE_ENV}-play-marketings`;
        marketing = await PostMarketings(body);
        if (!marketing || !marketing.id || !marketing.uuid || !marketing.frequency || !marketing.fn_arn) {
            throw new Error("Error while creating marketing entity");
        }

        const state = marketing.status === STATUS.ACTIVE ? "ENABLED" : "DISABLED";
        // Create a cronjob associated in aws
        const eventBridge = await createCronEvent(marketing.uuid, marketing.frequency, marketing.fn_arn, state, body.name);

        const result = await PutMarketings( 
            {
                id: marketing.id,
                event_rule: eventBridge
            }
        );

        return {
            statusCode: 201,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] postMarketings : ", error);
        if(marketing.uuid){
            await PutMarketings({
                id: marketing.id,
                status: STATUS.INACTIVE
            });
        }
        throw error;
    }
};
