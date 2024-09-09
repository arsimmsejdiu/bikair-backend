import serverlessExpress from "@vendia/serverless-express";

import { app } from "./app";

export const handler: ReturnType<typeof serverlessExpress<any, any>> = serverlessExpress({ app });
