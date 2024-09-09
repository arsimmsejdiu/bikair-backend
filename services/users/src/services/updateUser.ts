import {v4 as uuidv4} from "uuid";

import {BASE_URL, MICROSERVICE_PUSH_NOTIF_USER_ID, STRIPE_SECRET_KEY, STRIPE_TAX_RATES} from "../config/config";
// import {SendMessage} from "@bikairproject/fcm";
import {
    mailValidationEmail,
    mailWelcomeUser,
    PutUserInput,
    TranslateUtils,
    UserSettingsModel,
    UsersModel
} from "@bikairproject/lib-manager";
import {StripeApi} from "@bikairproject/stripe-api";


const generateRandomCode = () => `${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

export const updateUser = async (userId: number, body: PutUserInput, clientVersion: string, os: string, locale: string) => {
    let stripe_customer, code;
    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" ||
            typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        const user = await UsersModel.findByPk(userId);

        if (!user) {
            return {
                statusCode: 404,
                result: "NO_USER_FOUND"
            };
        }


        if (!body.firstname) {
            console.log("Missing firstname");
            return {
                statusCode: 409,
                result: "PARAMS_NAME.firstname"
            };
        }
        if (!body.lastname) {
            console.log("Missing lastname");
            return {
                statusCode: 409,
                result: "PARAMS_NAME.lastname"
            };
        }
        if (!body.email) {
            console.log("Missing email");
            return {
                statusCode: 409,
                result: "PARAMS_NAME.email"
            };
        }

        // If new user check for all infos AND create a stripe customer ID
        if (!user?.stripe_customer) {
            if (!body.firstname) {
                console.log("Missing firstname");
                return {
                    statusCode: 409,
                    result: "PARAMS_NAME.fname"
                };
            }
            if (!body.lastname) {
                console.log("Missing lastname");
                return {
                    statusCode: 409,
                    result: "PARAMS_NAME.lname"
                };
            }
            if (!body.city_id) {
                console.log("Missing city_id");
                return {
                    statusCode: 409,
                    result: "PARAMS_NAME.city_id"
                };
            }
            if (!body.birthdate) {
                console.log("Missing birthdate");
                return {
                    statusCode: 409,
                    result: "PARAMS_NAME.birthdate"
                };
            }
            if (!body.email) {
                console.log("Missing email");
                return {
                    statusCode: 409,
                    result: "PARAMS_NAME.email"
                };
            }
            if (!body.phone) {
                console.log("Missing phone");
                return {
                    statusCode: 409,
                    result: "PARAMS_NAME.phone"
                };
            }

            // Create a new stripe customer
            const fullName = body.firstname + " " + body.lastname;
            const stripeCus = await stripeApi.createCustomer(
                body.phone.trim(),
                body.email.trim().toLowerCase(),
                fullName.trim(),
                String(user.id),
                clientVersion
            );

            // Initialize users-settings table
            const userSettings = await UserSettingsModel.findOne({
                where: {
                    user_id: user.id
                }
            });
            if (!userSettings) {
                await UserSettingsModel.create({
                    user_id: user.id,
                    topics: ["PROMOTIONS", "INFORMATIONS"],
                    device_token: body.device_token,
                    device_brand: os,
                    device_os_version: clientVersion
                });
            } else {
                await UserSettingsModel.update({
                    topics: ["PROMOTIONS", "INFORMATIONS"],
                    device_token: body.device_token,
                    device_brand: os,
                    device_os_version: clientVersion
                }, {
                    where: {
                        user_id: user.id
                    }
                });
            }

            // Create a sponsor code
            stripe_customer = stripeCus.id;
            code = "SP-" + generateRandomCode();
        } else {
            stripe_customer = user.stripe_customer;
            code = user.code;
            // Update stripe infos
            console.log(`Updating stripe customer ${user.stripe_customer}`);
            await stripeApi.updateCustomer(
                stripe_customer,
                body.firstname.trim(),
                body.lastname.trim(),
                body.email.trim().toLowerCase(),
                user.phone.trim()
            );
        }

        // Update user infos
        console.log(`Updating user ${user.id}`);
        console.log("body.birthdate = ", body?.birthdate);
        let birthdate: string | null = null;
        if (body.birthdate) {
            const split = body.birthdate.split("/");
            if (split.length === 3) {
                const date = new Date();
                date.setFullYear(Number(split[2]), Number(split[1]), Number(split[0]));
                birthdate = date.toDateString();
            } else {
                birthdate = body.birthdate;
            }
        }
        console.log("Birthdate = ", birthdate);
        await UsersModel.update({
            firstname: body.firstname.trim(),
            lastname: body.lastname.trim(),
            email: body.email.trim().toLowerCase(),
            city_id: body.city_id,
            resident: body.resident,
            birthdate: birthdate,
            client_version: clientVersion,
            stripe_customer: stripe_customer,
            terms_accepted: body.terms_accepted,
            code: code.toUpperCase(),
            status: "ACTIVE",
            os: os,
            score: 0.5
        }, {
            where: {
                id: user.id
            }
        });

        // For new user send welcome email
        if (!user.stripe_customer) {
            const to = body.email.trim().toLowerCase();
            const token = uuidv4();
            const url = `${BASE_URL}/auth/email-validate?token=${token}`;
            const data = {
                firstname: body.firstname.trim(),
                url: url
            };
            await mailWelcomeUser(to, data, locale);
            // 1. Send a message type push-notification to new users
            // if (MICROSERVICE_PUSH_NOTIF_USER_ID) {
            // const i18n = new TranslateUtils(locale ?? "en");
            // await i18n.init();
            // const title = i18n.t("welcome.title");
            // const message = i18n.t("welcome.message");
            // await SendMessage([body.device_token ?? ""], title, message, "NotificationItem", "NOTIFICATION", true);
            // }

            // 2. Send a verifcation email
            await UsersModel.update({
                tmp_token: token,
                email_verified: false
            }, {
                where: {
                    id: user.id
                }
            });
        }

        if (body.email.trim().toLowerCase() !== user.email) {
            const token = uuidv4();
            await UsersModel.update({
                tmp_token: token,
                email_verified: false
            }, {
                where: {
                    id: user.id
                }
            });

            const url = `${BASE_URL}/auth/email-validate?token=${token}`;
            await mailValidationEmail(body.email, user.firstname + " " + user.lastname, url, user?.locale ?? "fr");
        }

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] clientVersion : ", clientVersion);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
