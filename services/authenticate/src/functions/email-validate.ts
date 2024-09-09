import {APIGatewayProxyEvent, APIGatewayProxyEventV2, Callback, Context} from "aws-lambda";

import {MICROSERVICE_NOTIFICATION} from "../config/config";
import {invokeAsync} from "@bikairproject/aws/dist/lib";
import {closeConnection, ErrorUtils, loadSequelize, TranslateUtils, UsersModel} from "@bikairproject/lib-manager";


export const handler = async (event: APIGatewayProxyEventV2 | APIGatewayProxyEvent, context: Context, callBack: Callback) => {
    const locale = event.headers["x-locale"] ?? "fr";
    try {
        await loadSequelize();
        context.callbackWaitsForEmptyEventLoop = false;

        const token = event?.queryStringParameters?.token ?? null;
        if (!token) {
            console.log("Missing token.");
            callBack(null, {
                statusCode: 200,
                headers: {
                    "Content-Type": "text/html",
                },
                body: `<div style="display: flex; height: 100vh;justify-content: center;align-items:center">
                    <div style="text-align: center">
                        <img  src="https://static.bik-air.fr/images/logoBlue.png" height="200"/>
                        <h1>Bik'Air</h1>
                        <h2>Nous n'avons pas pu r&eacute;cup&eacute;rer le token de v&eacute;rification...</h2>
                    </div>
            </div>`,
            });
            return;
        }

        const user = await UsersModel.findOne({where: {tmp_token: token}});
        if (!user) {
            console.log("Missing token.");
            callBack(null, {
                statusCode: 200,
                headers: {
                    "Content-Type": "text/html",
                },
                body: `<div style="display: flex; height: 100vh;justify-content: center;align-items:center">
                    <div style="text-align: center">
                        <img  src="https://static.bik-air.fr/images/logoBlue.png" height="200"/>
                        <h1>Bik'Air</h1>
                        <h2>Ce token n'est associ&eacute; &agrave; aucun utilisateur.</h2>
                    </div>
            </div>`,
            });
            return;
        }
        await UsersModel.update({tmp_token: null, email_verified: true}, {where: {id: user.id}});

        callBack(null, {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            body: `<div style="display: flex; height: 100vh;justify-content: center;align-items:center">
                    <div style="text-align: center">
                        <img  src="https://static.bik-air.fr/images/logoBlue.png" height="200"/>
                        <h1>Bik'Air</h1>
                        <h2>Votre email a &eacute;t&eacute; valid&eacute;. Merci ${user.firstname}</h2>
                    </div>
            </div>`,
        });
    } catch (error) {
        const i18n = new TranslateUtils(locale ?? "fr");
        await i18n.init();
        const message = i18n.t(ErrorUtils.getMessage(error));
        console.log(error);
        const from = "GET /auth/email-validate";
        const payload = ErrorUtils.getSlackErrorPayload(from, message);
        await invokeAsync(MICROSERVICE_NOTIFICATION, payload);

        callBack(null, {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            body: `<div style="display: flex; height: 100vh;justify-content: center;align-items:center">
            <div style="text-align: center">
                <img  src="https://static.bik-air.fr/images/logoBlue.png" height="200"/>
                <h1>Bik'Air</h1>
                <h2>Oops, un erreur c'est produit, veuillez contacter notre service support</h2>
            </div>
    </div>`,
        });
    } finally {
        // Ensure you are closing the connexion
        await closeConnection();
    }
};
