import axios from "axios";

import { NODE_ENV, SMS_API_FROM, SMS_API_HOST, SMS_API_TOKEN } from "../config";
import SmsEvent from "../models/SmsEvent";
import slack from "./slack";
import { sendMessageToSlack } from "./slack-v2";

const opts = { headers: { Authorization: `Bearer ${SMS_API_TOKEN}` } };

interface SendConfig {
    from: string
    to: string
    template: string
    param1: string
    format: string
}

const send = async (smsConfig: SendConfig) => {
    try {
        console.log("smsConfig : ", smsConfig);
        if (!smsConfig.to) {
            console.log("Missing smsConfig.to");
            return;
        }

        if (smsConfig.to.includes("4179977") || smsConfig.to.includes("9989799")) {
            console.log("Number is excluded");
            return;
        }

        if (NODE_ENV === "production" || NODE_ENV === "staging") {
            console.log("Sending api call to ", `${SMS_API_HOST}/sms.do`);
            const config = {
                ...opts,
                params: smsConfig
            };
            console.log("config : ", config);
            const { data, status } = await axios.get(`${SMS_API_HOST}/sms.do`, config);

            if (data && typeof data === "string" && data.length >= 5 && data.substring(0, 5) === "ERROR") {
                if (status === 103) {
                    await slack({
                        topic: "slack-notification",
                        message: "Error sending SMS",
                        type: "alert"
                    });
                }
                return false;
            } else if (typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "error")) {
                if (data.error === 103) {
                    await slack({
                        topic: "slack-notification",
                        message: "Error sending SMS",
                        type: "alert"
                    });
                }
                return false;
            }
        } else {
            console.log(
                "[Bik'air] This sms would have been sent in production: " +
                JSON.stringify(smsConfig)
            );
        }
        const { data } = await axios.get(`${SMS_API_HOST}/profile`, {
            ...opts
        });
        console.log(data);
        if (data.points && data.points < 5) {
            await sendMessageToSlack({
                message: `Les crédits SMS arrivent à expiration : ${data.points} points`,
                type: "urgent",
                topic: "slack-notification-v2",
            });
            await slack({
                topic: "slack-notification",
                message: `Les crédits SMS arrivent à expiration : ${data.points} points`,
                type: "alert"
            });
        }

        return true;
    } catch (error) {
        console.error("Error while sending SMS.");
        console.log(error);
        return error;
    }
};

const sms = async (args: SmsEvent) => {
    try {
        // See multilingual templates at https://ssl.smsapi.com/react/sms-templates
        return await send({
            from: SMS_API_FROM,
            to: args.phone,
            template: args.template,
            param1: args.param1,
            format: "json"
        });
    } catch (error) {
        console.log(error);
        return error;
    }
};

export default sms;
