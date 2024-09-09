import { GetBikeBooked } from "../dao/GetBikeBooked";
import { GetBikesNearBy } from "../dao/GetBikesNearBy";
import { BIKE_STATUS, closeExpiredBookings, getRentalEnd, UsersModel } from "@bikairproject/lib-manager";

export const getBikesUser = async (userId: number, origin: string, appVersion: string, query: any) => {
    try {
        let limit, offset, status, lastUpdate, tag;
        if (query && query.limit) {
            limit = query.limit;
        }
        if (query && query.offset) {
            offset = query.offset;
        }
        if (query && query.status) {
            status = query.status;
        }
        if (query && query.lastUpdate) {
            lastUpdate = query.lastUpdate;
        }
        if (query && query.tag) {
            tag = query.tag;
        }

        const statusValue = status ? JSON.parse(status) : [BIKE_STATUS.AVAILABLE];
        console.log("statusValue = ", statusValue);

        if (userId) {
            await closeExpiredBookings(userId, origin);
        }

        const rental = await getRentalEnd(userId);
        if(rental){
            statusValue.push(BIKE_STATUS.RENTAL);
        }
        const result = await GetBikesNearBy(statusValue, undefined, undefined, undefined, limit, offset, lastUpdate, tag);

        if (typeof userId === "undefined" || userId === null) {
            result.lastUpdate = null;
        }

        try {
            await UsersModel.update({
                client_version: appVersion
            }, {
                where: {
                    id: userId
                }
            });
        } catch (error) {
            console.log("Error While trying to update user version");
        }

        const bookedBike = await GetBikeBooked(userId, lastUpdate);

        if (bookedBike) {
            result.rows = [bookedBike, ...result.rows];
        }

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] origin : ", origin);
        console.log("[ERROR] query : ", query);
        throw error;
    }
};
