import {QueryTypes} from "sequelize";

import {MICROSERVICE_NOTIFICATION, NODE_ENV, SLACK_NOTIFICATION } from "../config/config";
import { invokeAsync } from "@bikairproject/aws/dist/lib";
import {BatchesModel, closeConnection, getSequelize, loadSequelize} from "@bikairproject/database";
import { ErrorUtils } from "@bikairproject/utils";

export const playBatch = async (eventRule: string) => {
    let batchName = "unknown";
    try{
        await loadSequelize();
        console.log("It is the time for MarketingCampaigns");
        const batch = await BatchesModel.findOne({
            where: {
                event_rule: eventRule,
                status: "ACTIVE"
            }
        });

        if(!batch?.request){
            throw new Error("No batch event rule");
        }

        await getSequelize().query(batch.request, {
            plain: false,
            raw: false,
            type: QueryTypes[batch.type]
        });
        batchName = batch.name;
        const payload = {
            message: `[${NODE_ENV}] ${batch.name}`,
            topic: SLACK_NOTIFICATION,
            type: "batch"
        };

        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
        
        return true;
    }catch(err){
        await closeConnection();
        console.log("No event rules ", err);
        await ErrorUtils.getSlackErrorPayload("[PLAY-BATCH]-"+batchName, new Error(err.message));
    }
};
