import * as aws from "@aws-sdk/client-ses";
import { createTransport, SendMailOptions } from "nodemailer";

import { NODE_ENV } from "../config";
import MailEvent from "../models/MailEvent";

const mail = async (requestBody: MailEvent) => {
    const { from, to, subject, html } = requestBody;

    let emailConfiguration;
    if (NODE_ENV === "develop") {
        console.log("etheral conf...");
        emailConfiguration = { //https://ethereal.email
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: "mohammad87@ethereal.email",
                pass: "cfZHdJbUGyMtrzawvz"
            }
        };
    } else {
        console.log("aws ses conf...");
        const ses = new aws.SES({ region: "eu-west-3" });
        emailConfiguration = {
            SES: {
                ses: ses,
                aws: aws
            }
        };
    }

    const transporter = createTransport(emailConfiguration);

    const mailOptions: SendMailOptions = {
        from: from,
        to: to,
        text: "If you can't open this email please contact your local developer",
        subject: subject,
        html: "<p>Bik'air</p>"
    };

    // Generate the html content
    mailOptions.html = html;
    console.log("Mail is ready. Sending...", mailOptions);
    try {
        await transporter.sendMail(mailOptions);
        console.log("Done.");
    } catch (error) {
        console.error("Error while sending mail.");
        console.log(error);
        return error;
    }
};

export default mail;
