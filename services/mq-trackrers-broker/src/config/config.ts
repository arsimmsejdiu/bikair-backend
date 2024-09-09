export const NODE_ENV: string = process.env.NODE_ENV ?? "develop";
export const MICROSERVICE_NOTIFICATION: string = process.env.MICROSERVICE_NOTIFICATION ?? "";
export const GOOGLE_GEOCODING_API_KEY: string | undefined = process.env.GOOGLE_GEOCODING_API_KEY;
export const EMAIL_ALERT = "alert@bik-air.com";
export const EMAIL_APP = "scripts@bik-air.com";
export const MIN_UPDATE_TRACKER: number = Number(process.env.MIN_UPDATE_TRACKER) ?? 60; // in minutes

