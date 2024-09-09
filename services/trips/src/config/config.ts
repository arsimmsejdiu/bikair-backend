export const NODE_ENV: string = process.env.NODE_ENV ?? "develop";
export const MICROSERVICE_NOTIFICATION: string | undefined = process.env.MICROSERVICE_NOTIFICATION;
export const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_TAX_RATES: string = process.env.STRIPE_TAX_RATES || "";
export const GOOGLE_GEOCODING_API_KEY: string | undefined = process.env.GOOGLE_GEOCODING_API_KEY;

export const AXA_UUID_SERVICE = "00001523-E513-11E5-9260-0002A5D5C51B";
export const AXA_UUID_LOCK_CHAR = "00001525-E513-11E5-9260-0002A5D5C51B";
export const AXA_UUID_STATE_CHAR = "00001524-E513-11E5-9260-0002A5D5C51B";

export const SLACK_NOTIFICATION = "slack-notification";
export const RETURN_URL_PAYMENT = "bikair://payment-trip";
export const INIT_PRICE_TRIP = 15;
export const MIN_AMOUNT = 50;
export const MINUTES_EXPERIMENTATION = 60;
