import { Context,ScheduledEvent } from "aws-lambda";

import { playMarketings } from "../services/playMarketings";

export const handler = async (event: ScheduledEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log("[EVENT]", event);
    if(event.resources[0]){
        await playMarketings(event.resources[0]);
    }
};
