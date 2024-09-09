import Crisp from "crisp-api";
import express from "express";

import {
    CRISP_IDENTIFIER,
    CRISP_KEY,
    MICROSERVICE_PUSH_NOTIF_USER_ID
} from "../config/config";
import { UserSettingsModel, UsersModel } from "@bikairproject/database";
import { invokeAsync } from "@bikairproject/lambda-utils";
import {TranslateUtils} from "@bikairproject/translate";


const router = express.Router();

/**
 * Send a notification to user on ticket crisp update --
 */
router.post("/notify", async (req, res, next) => {
    try {
        console.log("Requestbody from crisp: ", req.body);
        if (!req.body.data.session_id) {
            throw new Error("Missing user id in body params");
        }
        if(typeof MICROSERVICE_PUSH_NOTIF_USER_ID === "undefined") {
            return res.status(500).send("Missing MICROSERVICE_PUSH_NOTIF_USER_ID value").end();
        }
        // https://docs.crisp.chat/references/rest-api/v1/#get-messages-in-conversation
        if(req.body.data.type !== "text"){
            return res.status(200).send("No need to notify").end();
        }

        const CrispClient = new Crisp();
        CrispClient.authenticateTier("plugin", CRISP_IDENTIFIER, CRISP_KEY);
        const userInfo = await CrispClient.website.getConversation(req.body.website_id, req.body.data.session_id);

        console.log("Crisp returned user : ", userInfo);
        const user = await UsersModel.findOne({where: {email: userInfo.meta.email}});
        console.log("Bik'Air returned user : ", user);

        if(!user) {
            return res.status(200).send(`User with email ${userInfo.meta.email} not found`).end();
        }

        const userSettings = await UserSettingsModel.findOne({where: {user_id: user.id}});
        if(userSettings) {
            await UserSettingsModel.update(
                {
                    unread_tickets: (userSettings.unread_tickets ?? 0) + 1,
                },
                {
                    where: {
                        id: userSettings.id
                    }
                }
            );
        }

        const i18n = new TranslateUtils(user?.locale ?? "fr");
        await i18n.init();

        await invokeAsync(MICROSERVICE_PUSH_NOTIF_USER_ID, {
            message: i18n.t("crisp.tickets.incoming_msg.message"),
            title: i18n.t("crisp.tickets.incoming_msg.title"),
            user_ids: [user.id],
            topic: "INFORMATIONS",
            role: "SUPPORT",
            redirectTo: "Help",
            save: false
        });

        return res.status(200).send("Ok").end();
    } catch (error) {
        console.log("Error while sending crisp notification", error.message);
        next(error);
    }
});

export default router;
