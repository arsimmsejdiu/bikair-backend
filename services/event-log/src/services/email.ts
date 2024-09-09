import {
    EMAIL_APP,
    EMAIL_MAINTENANCE,
    EMAIL_NOTIFICATION,
    MICROSERVICE_NOTIFICATION,
    NODE_ENV
} from "../config/config";
import _lockNotif from "../template/_lock_notif";
import { invokeAsync } from "@bikairproject/aws/dist/lib";
import { AdminsModel, BikesModel, DateUtils } from "@bikairproject/lib-manager";

const googleAPIURI = "https://www.google.com/maps/search/?api=1&query=";

/**
 *
 * @param {*} from sender
 * @param {*} to receiver
 * @param {*} data will be use in our template
 * @param {*} template template name
 * @param attachments {any[] | null}
 */
const sendMail = async (from, to, data, template) => {
    const action = data.action === "close" ? "Fermeture Cadenas" : "Ouverture Cadenas";

    // Prepare the email body to be send as paramaters in aws-sns
    const mailOptions = {
        from: `Bik’air 🚲 ! <${from}>`,
        to: to,
        text: "If you can\\'t open this email please contact your local developer",
        subject: `[${action}]-[${data.firstname + " " + data.lastname}]-[${data.bike_name}]`,
        topic: EMAIL_NOTIFICATION,
        html: template(data),
        fake: NODE_ENV !== "production"
    };

    return await invokeAsync(MICROSERVICE_NOTIFICATION, mailOptions);
};


export const mailLockNotif = async (admin: AdminsModel, bike: BikesModel | null, address, action) => {
    try {
        console.log("Sending lock notification " + EMAIL_MAINTENANCE);
        await sendMail(EMAIL_APP, EMAIL_MAINTENANCE, {
            firstname: admin.firstname,
            lastname: admin.lastname,
            bike_status: bike?.status,
            bike_name: bike?.name,
            tech_link_address: googleAPIURI + encodeURI(address),
            tech_address: address,
            bike_address: bike?.address,
            bike_link_address: googleAPIURI + encodeURI(bike?.address ?? ""),
            action: action,
            date: DateUtils.toLocaleDateTimeString(new Date())
        }, _lockNotif);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
