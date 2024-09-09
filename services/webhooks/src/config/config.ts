export const NODE_ENV: string = process.env.NODE_ENV ?? "develop";
export const MICROSERVICE_NOTIFICATION: string | undefined = process.env.MICROSERVICE_NOTIFICATION;
export const STRIPE_SECRET_KEY: string | undefined = process.env.STRIPE_SECRET_KEY;
export const STRIPE_TAX_RATES: string | undefined = process.env.STRIPE_TAX_RATES;
export const MICROSERVICE_PUSH_NOTIF_USER_ID: string | undefined = process.env.MICROSERVICE_PUSH_NOTIF_USER_ID;
export const CRISP_IDENTIFIER: string  = process.env.CRISP_IDENTIFIER ?? "";
export const CRISP_KEY: string  = process.env.CRISP_KEY ?? "";
