import { Context, ScheduledEvent } from "aws-lambda";

import SaveUserNotifications from "../dao/SaveUserNotification";


export const handler = async (event: any, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log("[EVENT]", event);
    if(event?.uuid && event?.cleanTokens && event?.title && event?.message && event?.redirectTo && event?.type){
        await SaveUserNotifications(event.uuid, event.cleanTokens, event.title, event.message, event.redirectTo, event.type);
    }
};
