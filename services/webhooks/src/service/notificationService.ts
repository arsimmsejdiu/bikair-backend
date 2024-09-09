import { MICROSERVICE_NOTIFICATION, NODE_ENV } from "../config/config";
import { invokeAsync } from "@bikairproject/lambda-utils";
import { ErrorUtils } from "@bikairproject/utils";

export const sendSlackError = async (req: any, err: any) => {
    const env = NODE_ENV === "production" ? "" : NODE_ENV;
    const from = `WEBHOOKS ${env} ${req.method} ${req.originalUrl}`;
    const payload = await ErrorUtils.getSlackErrorPayload(
        from,
        err,
        req.locale || "fr"
    );
    if (MICROSERVICE_NOTIFICATION) {
        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
    }
};

export const sendSlackAlert = async (req: any, err: any) => {
    const env = NODE_ENV === "production" ? "" : NODE_ENV;
    const from = `WEBHOOKS ${env} ${req.method} ${req.originalUrl}`;
    const payload = await ErrorUtils.getSlackErrorPayload(
        from,
        err,
        req.locale || "fr"
    );
    payload.type = "alert";
    if (MICROSERVICE_NOTIFICATION) {
        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
    }
};
