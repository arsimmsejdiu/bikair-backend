import express from "express";

import gateway from "./gateway";
import { sendSlackError } from "./service/notificationService";
import { closeConnection, loadSequelize } from "@bikairproject/database";
import { ErrorUtils } from "@bikairproject/utils";

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// Catch locale from client and open sequelize connection
app.use(async (req, res, next) => {
    console.log(`[${req.method}--] : ${req.url}`);
    await loadSequelize();
    next();
});

//Close sequelize connection
app.use(function(req, res, next) {
    res.on("finish", async () => {
        await closeConnection();
    });
    next();
});

// API GATEWAY
app.use("/v1", gateway);

// Error handling middleware
app.use(async (err, req, res, next) => {
    const message = await ErrorUtils.getMessage(err, req.locale || "fr");

    if (err.status !== 401) {
        await sendSlackError(req, err);
    }

    console.log(`[${err.status || 500}] ${message}`);

    return res
        .status(err.status || 500)
        .send(message)
        .end();
});


export { app };
