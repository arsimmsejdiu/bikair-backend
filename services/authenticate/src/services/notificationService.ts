import { MICROSERVICE_NOTIFICATION, NODE_ENV, SLACK_NOTIFICATION } from "../config/config";
import { invokeAsync } from "@bikairproject/aws/dist/lib";

export const sendSms = async (payload) => {
    try {
        if (NODE_ENV === "develop" || NODE_ENV === "test") {
            console.log(`Test environment, don't send SMS. otp is : ${payload.param1}`);
            return true;
        } else {
            console.log(`Sending SMS to ${payload.phone}`);
            payload = {
                ...payload,
                topic: "sms-notification"
            };

            return await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
        }
    } catch (error) {
        console.log(`Error sending SMS ${payload}`);
        throw error;
    }
};

export const sendSlackAlert = async (message) => {
    try {
        console.log("Sending alert to slack");
        const payload = {
            message: `[${NODE_ENV}] ${message}`,
            topic: SLACK_NOTIFICATION,
            type: "alert"
        };

        return await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
    } catch (error) {
        console.log(`Error sending slack notification ${message}`);
        throw error;
    }
};
