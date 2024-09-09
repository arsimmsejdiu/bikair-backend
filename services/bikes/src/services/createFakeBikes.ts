import { NODE_ENV } from "../config/config";
import { BatteriesModel, BikesModel, getSequelize, LocksModel, Point, TrackersModel } from "@bikairproject/lib-manager";

const random = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

export const createFakeBikes = async (nBike: number) => {
    const transaction = await getSequelize().transaction();
    try {

        // Block request if prodution
        if (NODE_ENV === "production") {
            return {
                statusCode: 409,
                result: "No fake bike in production."
            };
        }

        if (!nBike) {
            return {
                statusCode: 409,
                result: "You must specify the number of bike you wish to create !"
            };
        }

        for (let i = 0; i < nBike; i++) {
            const lat = Math.floor(10000 + Math.random() * 90000);
            const lng = Math.floor(10000 + Math.random() * 90000);

            const newLock = await LocksModel.create({
                uid: random(11),
                mac: random(10),
                keysafe_id: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                state: "CLOSED",
                status: "ACTIVE",
                version: "erlV2"
            });

            const newBattery = await BatteriesModel.create({
                full_capacity: 70,
                voltage: 0,
                capacity: 15,
                soc: 0,
                status: "ACTIVE",
                bike_id: null
            });

            const point: Point = { type: "Point", coordinates: [Number("2.3" + lng), Number("48.8" + lat)] };
            const newTracker = await TrackersModel.create({
                imei: random(10),
                mac: random(10),
                status: "ACTIVE",
                coordinates: point
            });

            const newBike = await BikesModel.create({
                lock_id: newLock.id,
                tracker_id: newTracker.id,
                battery_id: newBattery.id,
                name: String(1001 + i),
                status: "PREPARATION",
                city_id: 1
            });

            await LocksModel.update({
                bike_id: newBike.id
            }, {
                where: {
                    id: newLock.id
                }
            });
            await BatteriesModel.update({
                bike_id: newBike.id
            }, {
                where: {
                    id: newBattery.id
                }
            });
            await TrackersModel.update({
                bike_id: newBike.id
            }, {
                where: {
                    id: newTracker.id
                }
            });
        }

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] nBike : ", nBike);
        await transaction.rollback();
        throw error;
    }
};
