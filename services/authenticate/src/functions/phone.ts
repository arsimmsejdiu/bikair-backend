import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import {
    BLACKLIST_AMOUNT_THRESHOLD,
    BLACKLIST_MINUTE_THRESHOLD,
    JWT_SECRET_TMP,
    MICROSERVICE_NOTIFICATION,
    NODE_ENV
} from "../config/config";
import httpResponses from "../services/httpResponses";
import { checkingIpMatchWithPhone } from "../services/ipMappingService";
import { sendSlackAlert, sendSms } from "../services/notificationService";
import { findUserByPhone } from "../services/usersServices";
import { invokeAsync } from "@bikairproject/aws/dist/lib";
import {
    BikairAuthorizerContext,
    closeConnection,
    CountriesModel,
    ErrorUtils,
    getSequelize,
    loadSequelize,
    mailOtpValidation,
    Security,
    SessionsModel,
    TranslateUtils,
    Trips,
    TripsModel,
    UsersModel
} from "@bikairproject/lib-manager";

const AUTH_IP = ["185.132.67.6", "116.110.42.208"];

function isTimeDifferenceGreaterThanXMinutes(minutes: number, date1: number, date2: number) {
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(date1 - date2);
    // Calculate the equivalent number of milliseconds for 2 minutes
    const twoMinutesInMilliseconds = minutes * 60 * 1000;
    // Compare the time difference to 2 minutes
    return timeDifference > twoMinutesInMilliseconds;
}

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<BikairAuthorizerContext>) => {
    console.log("Start phone auth");
    const locale = event.headers["x-locale"] ?? "fr";
    try {
        await loadSequelize();
        const security = new Security();
        const body = JSON.parse(event.body ?? "{}");
        const os = event.headers["x-device"] ?? "Unknown";
        const client_version = event.headers["x-app-version"];

        // Cleanup phone and
        if (!body.phone || body.phone.length < 5) {
            await closeConnection();
            return httpResponses.blocked({
                message: "MISSING_PARAMS"
            });
        }
        const phone = body.phone.replace(/ /g, "");

        // Generate a random OTP
        const otp = Math.floor(10000 + Math.random() * 90000);
        // Generate temporary JWT
        const token = sign({ phone: phone }, JWT_SECRET_TMP ?? "", {
            expiresIn: "10m"
        });

        let user = await findUserByPhone(phone);
        console.log("[PHONE]", phone);

        // Ensure authorization is ok for apple/google submission
        if (
            phone === "0600000000" ||
            phone === "+33600000000" ||
            phone === "0611111111" ||
            phone === "+33611111111"
        ) {
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.ok({
                accessToken: token,
                newUser: false
            });
        }

        const ip = event.requestContext.http.sourceIp; // security.getIp(event);
        // security.logIpFromEvent(event);
        console.log("[SOURCE-IP-----------------------]", ip);

        let trips: Trips[] = [];
        if (user) {
            trips = await TripsModel.findAll({
                where: {
                    user_id: user.id
                }
            });
            const date1 = new Date(user.updated_at).getTime();
            const date2 = new Date().getTime();
            if (!isTimeDifferenceGreaterThanXMinutes(2, date1, date2) && !body.email_otp) {
                return httpResponses.requestError({
                    message: "WAIT_2_MINUTES_BEFORE_NEW_SMS"
                });
            }
        }

        if (ip !== "127.0.0.1" && trips.length === 0) {
            // Get authorized country list
            const countries = await CountriesModel.findOne({
                where: {
                    iso_2: body.countryCode
                }
            });
            console.log("Country : ", countries);
            if (!countries) {
                throw new Error(`${phone} - Country not authorized !`);
            }

            // const geo = await security.getCountry(ip);

            // console.log("geo = ", geo);

            // if (!geo) {
            //     throw new Error(`${phone} - No country found for IP.`);
            // }

            // console.log("geo = ", geo);

            // if (!geo) {
            //     throw new Error(`${phone} - No country found for IP.`);
            // }

            // Mapping one ip with one phone number
            await checkingIpMatchWithPhone(
                ip,
                phone,
                body.countryCode
            );

            // Ensure this is not an authorized IP address before blacklisting
            if (!AUTH_IP.includes(ip)) {
                await security.createQueryCountConnexion(
                    getSequelize(),
                    ip,
                    BLACKLIST_MINUTE_THRESHOLD,
                    BLACKLIST_AMOUNT_THRESHOLD + 1
                );
                const results = await security.getQueryResults(getSequelize(), ip);

                for (const result of results) {
                    console.log(`Number of lines = ${result.results?.length}`);
                    if (result.results && result.results.length > BLACKLIST_AMOUNT_THRESHOLD) {
                        await sendSlackAlert(
                            `Adding IP ${ip} to BlackList because it overcome security threshold (more than ${BLACKLIST_AMOUNT_THRESHOLD} within ${BLACKLIST_MINUTE_THRESHOLD} minutes).`
                        );
                        if (NODE_ENV === "production") {
                            await security.addIpToBlackList(ip);
                            // Ensure you are closing the connexion
                            await closeConnection();
                            throw new Error(`Adding IP ${ip} to BlackList because it overcome security threshold`);
                        }
                    }
                }
            }
        } else {
            console.log("Localhost, skipping security test");
            console.log("User exist, skipping security test");
        }

        // Is user already a register account ?
        if (!user) {
            // Create a new user account
            user = await UsersModel.create({
                phone: phone,
                locale: locale,
                otp: String(otp),
                client_version: client_version,
                tmp_token: uuidv4(),
                score: 0.5,
                status: "ACTIVE"
            });
        } else {
            // Ensure you delete all existing sessions
            if (user && user.uuid) {
                await SessionsModel.destroy({
                    where: { user_uuid: user.uuid }
                });
            }

            // Add new otp connect
            await UsersModel.update(
                {
                    locale: locale,
                    otp: String(otp),
                    client_version: client_version,
                    tmp_token: uuidv4(),
                    os: os
                }, {
                    where: {
                        id: user.id
                    }
                }
            );
            user = await UsersModel.findByPk(user.id);
        }

        // Checking if user has been blocked
        if (!user || user.is_block) {
            console.log(`User ${user?.id} is blocked`);
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.blocked({
                message: "BLOCKED_USER"
            });
        }

        // Send a sms with the otp
        let otpSent;
        if ((NODE_ENV === "production" || NODE_ENV === "staging") && body.mode !== "AUTOMATING_TESTING" && !body.email_otp) {
            otpSent = await sendSms({
                phone: phone,
                template: `verify_phone_${locale}`,
                param1: otp
            });
        } else {
            await sendSlackAlert(`OTP code : ${otp}`);
        }
        if (body.email_otp) {
            await mailOtpValidation(body.email || user.email, { otp: otp }, locale);
            otpSent = true;
        }

        if (!otpSent && (NODE_ENV !== "develop" && body.mode !== "AUTOMATING_TESTING")) {
            console.log("Error while sending SMS");
            // Ensure you are closing the connexion
            await closeConnection();
            return httpResponses.requestError({
                message: "ERROR_SENT"
            });
        }

        console.log("Done.");
        const otpMaybe = NODE_ENV !== "production" ? { otp: otp } : {};
        // Ensure you are closing the connexion
        await closeConnection();
        return httpResponses.ok({
            accessToken: token,
            ...otpMaybe,
            newUser:
                !user.stripe_customer ||
                !user.lastname ||
                !user.firstname ||
                !user.city_id
        });
    } catch (error) {
        const i18n = new TranslateUtils(locale ?? "fr");
        await i18n.init();
        const message = i18n.t(ErrorUtils.getMessage(error));
        console.log("----body----------", error);
        const from = "POST /auth/phone";
        const payload = ErrorUtils.getSlackErrorPayload(from, message);
        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);

        // Ensure you are closing the connexion
        await closeConnection();
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ErrorUtils.getMessage(error))
        };
    }
};
