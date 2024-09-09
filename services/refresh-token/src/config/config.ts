export const NODE_ENV: string = process.env.NODE_ENV ?? "develop";
export const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
export const ACCESS_JWT_LIMIT_CLIENT: string = process.env.ACCESS_JWT_LIMIT_CLIENT ?? "20m";

