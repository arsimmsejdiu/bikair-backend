export const NODE_ENV: string = process.env.NODE_ENV ?? "develop";
export const MICROSERVICE_PUSH_NOTIF_USER_ID: string = process.env.MICROSERVICE_PUSH_NOTIF_USER_ID ?? "";
export const AWS_REGION = "eu-west-3";
export const SLACK_NOTIFICATION = "slack-notification";
export const MICROSERVICE_NOTIFICATION = process.env.MICROSERVICE_NOTIFICATION || "bikair-send-notification-develop-microservice";
