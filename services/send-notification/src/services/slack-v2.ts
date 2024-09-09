import { WebClient } from "@slack/web-api";

import { NODE_ENV, 
    SECURITY_CHANNEL,
    SLACK_CANAL_ALERT_DEVELOPMENT, 
    SLACK_CANAL_ALERT_PRODUCTION, 
    SLACK_CANAL_BATCH_DEVELOPMENT, 
    SLACK_CANAL_BATCH_PRODUCTION, 
    SLACK_CANAL_ERROR_DEVELOPMENT,
    SLACK_CANAL_ERROR_PRODUCTION, 
    SLACK_CANAL_URGENT,
    SLACK_TOKEN } from "../config";
import SlackEvent from "../models/SlackEvent";

export const sendMessageToSlack = async (data: SlackEvent) => {
    const { from, message, type } = data;
    const token = SLACK_TOKEN;
    const web = new WebClient(token);
    let channel;
    switch (type) {
        case "alert":
            if (NODE_ENV === "production") {
                channel = SLACK_CANAL_ALERT_PRODUCTION;
            } else {
                channel = SLACK_CANAL_ALERT_DEVELOPMENT;
            }
            break;
        case "batch":
            if (NODE_ENV === "production") {
                channel = SLACK_CANAL_BATCH_PRODUCTION;
            } else {
                channel = SLACK_CANAL_BATCH_DEVELOPMENT;
            }
            break;
        case "urgent":
            channel = SLACK_CANAL_URGENT;
            break;
        case "error":
        default:
            if (NODE_ENV === "production") {
                channel = SLACK_CANAL_ERROR_PRODUCTION;
            } else {
                channel = SLACK_CANAL_ERROR_DEVELOPMENT;
            }
            break;
    }

    let text = "";
    text += from ? `[${from}] ` : "";
    text += message ? `${message}` : "";
        
    try{
        await web.chat.postMessage({
            text: text,
            channel: channel || SECURITY_CHANNEL,
            username: "Private Bot Infos"
        });
    }catch(err){
        console.log("[---------sendErrorMessageToSlack-------]: "+channel, err);
    }
};

