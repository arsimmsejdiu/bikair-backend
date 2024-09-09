import axios from "axios";

import {
    NODE_ENV,
    SLACK_CANAL_ALERT_DEVELOPMENT_WEBHOOK,
    SLACK_CANAL_ALERT_PRODUCTION_WEBHOOK,
    SLACK_CANAL_BATCH_DEVELOPMENT_WEBHOOK,
    SLACK_CANAL_BATCH_PRODUCTION_WEBHOOK,
    SLACK_CANAL_ERROR_DEVELOPMENT_WEBHOOK,
    SLACK_CANAL_ERROR_PRODUCTION_WEBHOOK} 
    from "../config";
import SlackEvent from "../models/SlackEvent";

const slack = async (data: SlackEvent) => {
    const { from, message, type } = data;
    try {

        let webhook;
        switch (type) {
            case "alert":
                if (NODE_ENV === "production") {
                    webhook = SLACK_CANAL_ALERT_PRODUCTION_WEBHOOK;
                } else {
                    webhook = SLACK_CANAL_ALERT_DEVELOPMENT_WEBHOOK;
                }
                break;
            case "batch":
                if (NODE_ENV === "production") {
                    webhook = SLACK_CANAL_BATCH_PRODUCTION_WEBHOOK;
                } else {
                    webhook = SLACK_CANAL_BATCH_DEVELOPMENT_WEBHOOK;
                }
                break;
            case "error":
            default:
                if (NODE_ENV === "production") {
                    webhook = SLACK_CANAL_ERROR_PRODUCTION_WEBHOOK;
                } else {
                    webhook = SLACK_CANAL_ERROR_DEVELOPMENT_WEBHOOK;
                }
                break;
        }

        let text = "";
        text += from ? `[${from}] ` : "";
        text += message ? `${message}` : "";

        const body = JSON.stringify({
            "text": text
        });

        const config = {
            headers: {
                "Content-type": "application/json"
            }
        };

        await axios.post(webhook, body, config);
        return true;
    } catch (error) {
        console.error(`Error while sending slack notification ${type}. With message${message}`);
        console.log(error);
        return error;
    }
};

export default slack;
