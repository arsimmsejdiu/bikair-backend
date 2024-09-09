import { Transaction } from "sequelize";

import { GetUserGame } from "../dao/GetUserGame";
import { SendMessage } from "@bikairproject/fcm";
import { DiscountsModel, UserDiscountsModel, UserGamesModel } from "@bikairproject/lib-manager";
import { STATUS } from "@bikairproject/lib-manager";

/**
 *
 * @param userId
 * @param deviceToken
 * @param locale
 */
export const checkGamePlayed = async (userId: number, deviceToken: string, locale: string, transaction?: Transaction) => {
    try{
        const userGame = await GetUserGame(userId, transaction);

        if(!userGame){
            console.log("No ongoing game for this userid", userId);
            return;
        }

        console.log("Checking if user reach the next level...");
        const reached: number = userGame.current_level * userGame.to_be_reached;
        if(userGame.total_trips === reached){
            console.log("User has reach a new level, creating a user discount code...");
            const discount: any = await DiscountsModel.findByPk(userGame.discount_ids[userGame.current_level-1], {
                transaction: transaction
            });
            if(discount){
                await UserDiscountsModel.create({
                    user_id: userId,
                    discount_id: discount.id,
                    used: false,
                    status: STATUS.ACTIVE,
                    code_ref: discount.code,
                    remaining: discount.value
                }, {
                    transaction: transaction
                });

                const body: any = {};
                if(userGame.current_level === userGame.discount_ids.length){
                    console.log("User reach the final level, reset game");
                    body.current_level = 1;
                    body.total_played = userGame.total_played +1;
                    body.started_at = new Date();
                } else {
                    console.log("User reach the next level");
                    body.current_level = userGame.current_level +1;
                }

                console.log("Updating user game infos...");
                await UserGamesModel.update(body, {
                    where: {id: userGame.id},
                    transaction: transaction
                });

                await sendNotification(deviceToken, locale, userGame);
            }else{
                console.log("[INFOS] - No discount found for id :", userGame.current_level-1);
            }
        }

    }catch(err){
        console.log("[ERROR] - while playing user game...", err);
        throw err;
    }
};


const sendNotification = async (deviceToken: string, locale: string, userGame: any) => {
    console.log("Sending notification once user reach a new level ", deviceToken);
    const message = userGame.description[locale].notifications[userGame.current_level-1];
    if(deviceToken) await SendMessage([deviceToken], "", message);
};


