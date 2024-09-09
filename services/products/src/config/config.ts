export const NODE_ENV: string = process.env.NODE_ENV ?? "develop";
export const STRIPE_SECRET_KEY: string | undefined = process.env.STRIPE_SECRET_KEY;
export const STRIPE_TAX_RATES: string | undefined = process.env.STRIPE_TAX_RATES;
export const RETURN_URL_SUBSCRIPTION = "bikair://payment-subscription";
export const RETURN_URL_PASS = "bikair://payment-pass";
