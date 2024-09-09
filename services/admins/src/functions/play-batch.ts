import { Context,ScheduledEvent } from "aws-lambda";

import { playBatch } from "../services/playBatch";

export const handler = async (event: ScheduledEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log("[EVENT]", event);
    if(event.resources[0]){
        await playBatch(event.resources[0]);
    }
};
