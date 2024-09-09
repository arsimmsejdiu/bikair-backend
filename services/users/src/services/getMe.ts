import {NODE_ENV} from "../config/config";
import {GetMe} from "../dao/GetMe";
import {BikesModel, DateUtils, getRentalEnd, TripsModel, UserMe, UsersModel} from "@bikairproject/lib-manager";

export const getMe = async (userId: number, locale: string, appVersion: string) => {
    try {
        await UsersModel.update({
            client_version: appVersion
        }, {
            where: {
                id: userId
            }
        });

        const user = await GetMe(userId);

        if (!user) {
            return {
                statusCode: 404,
                result: "NO_USER_FOUND"
            };
        }

        const lastTrip = await TripsModel.findOne({
            where: {
                user_id: user.id
            },
            order: [
                ["id", "DESC"]
            ]
        });

        let lastUsage = -1;
        let lastBikeName;
        if (lastTrip) {
            lastUsage = Math.floor(DateUtils.daysDiff(new Date(), new Date(lastTrip.created_at)) / 30);
            const bike = await BikesModel.findByPk(lastTrip.bike_id);
            if (bike) {
                lastBikeName = bike.name;
            }
        }

        const lastRentalEndTime = await getRentalEnd(user.id);

        const resultUser: UserMe = {
            id: user.id,
            uuid: user.uuid,
            firstname: user.firstname ?? "",
            lastname: user.lastname ?? "",
            email: user.email,
            phone: user.phone,
            locale: user.locale,
            city_id: user.city_id,
            city_name: user.city_name ?? "Unknown",
            birthdate: user.birthdate,
            resident: user.resident,
            email_verified: user.email_verified,
            terms_accepted: user.terms_accepted,
            user_age: user.age ?? 0,
            topics: user.topics ?? [],
            score: user.score,
            has_payment_method: !!user.card_token,
            sponsor_code: user.code ?? "",
            unread_tickets: user.unread_tickets ?? 0,
            last_usage: lastUsage,
            rental_end_time: String(lastRentalEndTime),
            production: NODE_ENV === "production",
            tmp_token: user.tmp_token,
            otp: user.otp,
            stripe_customer: user.stripe_customer,
            phone_verified: user.phone_verified,
            is_block: user.is_block,
            code: user.code,
            client_version: user.client_version,
            created_at: user.created_at,
            updated_at: user.updated_at,
            card_token: user.card_token ?? "",
            device_token: user.device_token ?? "",
            last_bike_name: lastBikeName

        };

        const isNewUser = !user.stripe_customer || !user.lastname || !user.email || !user.firstname || !user.city_id;

        return {
            statusCode: 200,
            result: {
                user: resultUser,
                newUser: isNewUser
            }
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
