import {QueryTypes} from "sequelize";

import { MICROSERVICE_NOTIFICATION, MICROSERVICE_PUSH_NOTIF_USER_ID, NODE_ENV, SLACK_NOTIFICATION } from "../config/config";
import { PutMarketings } from "./PutMarketings";
import { invokeAsync } from "@bikairproject/lambda-utils";
import { GetMarketingOutput, getSequelize, MarketingCampaignsModel,TOPICS} from "@bikairproject/lib-manager";


export const PlayMarketings = async (eventRule: string) => {

    console.log("It is the time for MarketingCampaignsModel", eventRule);
    const marketingCampaign = await MarketingCampaignsModel.findOne({
        where: {
            event_rule: eventRule,
            status: "ACTIVE"
        }
    });

    // If expired disabled eventBridge from aws
    if(marketingCampaign?.date_end && (Number(marketingCampaign?.date_end) <= Date.now())){
        marketingCampaign.status = "INACTIVE";
        await PutMarketings(marketingCampaign);
        return;
    }

    if(marketingCampaign){
        console.log("marketingCampaigns ID : ", marketingCampaign.id);
        const userIdsFR = await getSequelize().query<GetMarketingOutput>(`
                SELECT ARRAY(${marketingCampaign.request} AND u.locale = 'fr') AS user_ids
                `, {
            plain: false,
            raw: true,
            replacements: marketingCampaign.replacements,
            type: QueryTypes.SELECT
        });
        const titleFr: string | null = marketingCampaign.title?.fr ?? null;
        const messageFr: string | null = marketingCampaign.message?.fr ?? null;
        if(userIdsFR && userIdsFR.length > 0 && titleFr && messageFr){
            const payloadFr = {
                title: titleFr,
                message: messageFr,
                user_ids: userIdsFR[0]?.user_ids ?? [],
                topic: TOPICS.PROMOTIONS,
                role: "USER",
            };
            console.log("[Play-Campaign for]", payloadFr);
            invokeAsync(MICROSERVICE_PUSH_NOTIF_USER_ID, payloadFr);
        }

        // -------------------- English --------------

        const userIdsEN = await getSequelize().query<GetMarketingOutput>(`
                SELECT ARRAY(${marketingCampaign.request} AND u.locale = 'en') AS user_ids
                `, {
            plain: false,
            replacements: marketingCampaign.replacements,
            raw: false,
            type: QueryTypes.SELECT
        });
        const titleEn: string | null = marketingCampaign.title?.en ?? null;
        const messageEn: string | null = marketingCampaign.message?.en ?? null;
        if(userIdsEN && userIdsEN.length > 0 && titleEn && messageEn){
            const payloadEn = {
                title: titleEn,
                message: messageEn,
                user_ids: userIdsEN[0]?.user_ids ?? [],
                topic: TOPICS.PROMOTIONS,
                role: "USER",
            };
            console.log("[Play-Campaign for]", payloadEn);
            invokeAsync(MICROSERVICE_PUSH_NOTIF_USER_ID, payloadEn);
        }

        const payload = {
            message: `[${NODE_ENV}]-[Marketing-Batch] ${marketingCampaign.title?.fr}`,
            topic: SLACK_NOTIFICATION,
            type: "batch"
        };

        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);

    }else{
        console.log("No marketing campaign find for ", eventRule);
    }
};
