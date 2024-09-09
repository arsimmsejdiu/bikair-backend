import { Context } from "aws-lambda";

import MailEvent from "./models/MailEvent";
import NotificationEvent from "./models/NotificationEvent";
import SlackEvent from "./models/SlackEvent";
import SmsEvent from "./models/SmsEvent";
import mail from "./services/mail";
import slack from "./services/slack";
import {sendMessageToSlack} from "./services/slack-v2";
import sms from "./services/sms";

export const handler = async (event: NotificationEvent, context: Context) => {
    const topic = event.topic;
    console.log("topic : ", topic);
    try {
        switch (topic) {
            case "mail-notification":
                await mail(event as MailEvent);
                break;
            case "sms-notification":
                await sms(event as SmsEvent);
                break;
            case "slack-notification":
                await slack(event as SlackEvent);
                break;
            case "slack-notification-v2":
                await sendMessageToSlack(event as SlackEvent);
                break;
            default:
                console.log(`Type ${topic} is not handled !`);
                throw new Error("No topic found");
        }
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        };
    } catch (error) {
        console.error("Error while sending notification : ", error);
        const slackEvent: SlackEvent = {
            from: "send-notification",
            type: "error",
            message: error.message ?? error,
            topic: "slack-notification"
        };
        await slack(slackEvent);
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(error)
        };
    }
};

