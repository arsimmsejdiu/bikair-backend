import {QueryTypes, Transaction} from "sequelize";

import {getSequelize, UserSettingsModel} from "@bikairproject/database";

/**
 *
 * @param uuid
 * @param tokens
 * @param title
 * @param message
 * @param redirectTo
 * @param type IN_APP | NOTIFICATION
 * @param transaction
 * @returns
 */
const SaveUserNotifications = async (uuid: string, tokens: string[], title: string, message: string, redirectTo: string, type: string, transaction?: Transaction): Promise<void> => {
    try {
        const userSettings = await UserSettingsModel.findAll({
            where: {
                device_token: tokens
            },
            transaction: transaction
        });
        console.log("--------------SaveUserNotifications--------------");
        const userIds = userSettings.map(s => s.user_id);
        //Creating user_notifications for all user at once
        await getSequelize().query(`
            insert into user_notifications (title, message, read, redirect_to, type, user_id, uuid)
            SELECT :title, :message, false, :redirectTo, :type, u.id, :uuid
            from users u
            where u.id in (:userIds)
        `, {
            replacements: {
                title: title,
                message: message,
                redirectTo: redirectTo,
                type: type,
                uuid: uuid,
                userIds: userIds,
            },
            type: QueryTypes.INSERT,
            transaction: transaction
        });
        //Deleting the 6th (and more if there's any) notification for these users
        await getSequelize().query(`
            delete
            from user_notifications n
            where user_id in (:userIds)
              and n.id not in (select n2.id
                               from user_notifications n2
                               where n.user_id = n2.user_id
                               order by n2.id desc
                               limit 5)
        `, {
            replacements: {
                userIds: userIds,
            },
            type: QueryTypes.DELETE,
            transaction: transaction
        });
    } catch (err) {
        console.log("[ERROR]-SaveUserNotifications", err);
        return err;
    }
};

export default SaveUserNotifications;
