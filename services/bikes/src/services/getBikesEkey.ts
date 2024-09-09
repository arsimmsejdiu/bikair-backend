import {AXA_UUID_LOCK_CHAR, AXA_UUID_SERVICE, AXA_UUID_STATE_CHAR, KEYSAFE_API_KEY, MICROSERVICE_NOTIFICATION} from "../config/config";
import { invokeAsync } from "@bikairproject/aws/dist/lib";
import {KeysafeCloud} from "@bikairproject/axa-api";
import {AdminsModel, BIKE_STATUS, BikesModel, LocksModel, TRIP_STATUS, TripsModel, UsersModel} from "@bikairproject/lib-manager";

export const getBikesEkey = async (bikeId: number, userId: number, role: string | null | undefined, locale: string) => {
    try {
        const bike = await BikesModel.findByPk(bikeId);

        if (!bike) {
            console.log(`Bike ${bikeId} not found`);
            return {
                statusCode: 404,
                result: "BIKE_NOT_FOUND"
            };
        }

        if (typeof role === "undefined" || role === null || role === "USER") {
            const user = await UsersModel.findByPk(userId);
            if (!user) {
                console.log("User unknown with id ", userId);
                return {
                    statusCode: 404,
                    result: "BIKE_UNAVAILABLE"
                };
            }

            const trip = await TripsModel.findOne({
                where: {
                    user_id: userId,
                    bike_id: bikeId,
                    status: [TRIP_STATUS.OPEN, TRIP_STATUS.STARTING]
                }
            });

            if (!trip) {
                console.log("No Trip found.");
                return {
                    statusCode: 404,
                    result: "BIKE_UNAVAILABLE"
                };
            }
            const bikeAvailable =
                bike.status.includes(BIKE_STATUS.AVAILABLE) ||
                bike.status.includes(BIKE_STATUS.BOOKED) ||
                bike.status.includes(BIKE_STATUS.RENTAL) ||
                bike.status.includes(BIKE_STATUS.USED);
            if (!bikeAvailable) {
                console.log("Bike unavailable : ", bike.status);
                return {
                    statusCode: 404,
                    result: "BIKE_UNAVAILABLE"
                };
            }
        } else {
            const admin = await AdminsModel.findByPk(userId);
            if (!admin) {
                console.log("Admin unknown with id ", userId);
                return {
                    statusCode: 404,
                    result: "BIKE_UNAVAILABLE"
                };
            }
        }

        const lock = await LocksModel.findByPk(bike.lock_id);

        if (!lock) {
            console.log(`Lock ${bike.lock_id} not found`);
            return {
                statusCode: 404,
                result: "BIKE_NOT_FOUND"
            };
        }

        console.log("fetching eKeys");
        const keysafeCloud = new KeysafeCloud(KEYSAFE_API_KEY);
        const result = await keysafeCloud.getOtpKeys(lock.keysafe_id, 1);

        if (typeof result === "string") {
            console.log(`getOtpKeys : ${result}`);
            await invokeAsync(MICROSERVICE_NOTIFICATION, {
                message: "AXA: Error cadenas lors de la recuperation des keys : "+ result,
                type: "urgent",
                topic: "slack-notification-v2",
            });
            return {
                statusCode: 400,
                result: "Something went wrong."
            };
        }

        const {key, passkey} = result;

        console.log("converting eKeys");
        const _eKey = (key as string)
            .split("-")
            .map(key => Buffer.from(key, "hex"))
            .map(buffer => buffer.toString("base64"));
        const _passKey = (passkey as string)
            .split("-")
            .map(key => Buffer.from(key, "hex"))
            .map(buffer => buffer.toString("base64"));

        return {
            statusCode: 200,
            result: {
                rawResult: result,
                serviceUUID: AXA_UUID_SERVICE,
                characteristicUUID: AXA_UUID_LOCK_CHAR,
                stateUUID: AXA_UUID_STATE_CHAR,
                name: `AXA:${(lock.uid ?? "").toUpperCase()}`,
                eKey: _eKey,
                passKey: _passKey
            }
        };
    } catch (error) {
        console.log("[ERROR] bikeId : ", bikeId);
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] role : ", role);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
