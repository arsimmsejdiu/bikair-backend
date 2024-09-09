import { AXA_CLIENT_ID, AXA_CLIENT_SECRET, KEYSAFE_API_KEY, LATITUDE, LONGITUDE } from "../config/config";
import {getBikeDetail} from "./getBikeDetail";
import { Axa, KeysafeCloud } from "@bikairproject/axa-api";
import { BatteriesModel, BikesModel, BikeStatusModel, getSequelize, LocksModel, Point, PostBikesInput,TrackersModel  } from "@bikairproject/lib-manager";

export const createBikes = async (authorId: number, origin: string, body: PostBikesInput) => {
    const transaction = await getSequelize().transaction();
    const { bikeName, city, lockUid, lockClaimCode, lockVersion, trackerImei, trackerMac } = body;
    let newLock, newBattery, newTracker, newBike;

    try {
        if (!bikeName || !city || !lockUid || !lockClaimCode || !lockVersion || !trackerImei || !trackerMac) {
            console.warn("Missing parameters.");
            return {
                statusCode: 409,
                result: "Champs requis manquant."
            };
        }
        const keysafeCloud = new KeysafeCloud(KEYSAFE_API_KEY);
        const claimedLock = await keysafeCloud.claimLock(lockClaimCode, lockUid);

        const axa = new Axa(AXA_CLIENT_ID, AXA_CLIENT_SECRET);
        await axa.claimTracker(trackerImei);

        newLock = await LocksModel.create({
            uid: claimedLock.lock_uid,
            mac: claimedLock.mac_address,
            keysafe_id: claimedLock.id,
            state: "CLOSED",
            status: "ACTIVE",
            version: lockVersion
        }, {
            transaction: transaction
        });

        newBattery = await BatteriesModel.create({
            full_capacity: 70,
            voltage: 0,
            capacity: 15,
            soc: 0,
            status: "ACTIVE",
            serial: null,
            bike_id: null
        }, {
            transaction: transaction
        });

        const point: Point = { type: "Point", coordinates: [LONGITUDE, LATITUDE] };
        newTracker = await TrackersModel.create({
            imei: trackerImei,
            mac: trackerMac,
            status: "ACTIVE",
            coordinates: point
        }, {
            transaction: transaction
        });

        newBike = await BikesModel.create({
            lock_id: newLock.id,
            tracker_id: newTracker.id,
            battery_id: newBattery.id,
            name: bikeName,
            status: "PREPARATION",
            city_id: city
        }, {
            transaction: transaction
        });

        await BikeStatusModel.create({
            status: "PREPARATION",
            bike_id: newBike.id,
            origin: origin,
            author_id: authorId
        });

        await LocksModel.update({
            bike_id: newBike.id
        }, {
            where: {
                id: newLock.id
            },
            transaction: transaction
        });
        await BatteriesModel.update({
            bike_id: newBike.id
        }, {
            where: {
                id: newBattery.id
            },
            transaction: transaction
        });
        await TrackersModel.update({
            bike_id: newBike.id
        }, {
            where: {
                id: newTracker.id
            },
            transaction: transaction
        });

        await transaction.commit();

        const bike = await getBikeDetail(newBike.id);

        return {
            statusCode: 200,
            result: bike.result
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        await transaction.rollback();
        throw error;
    }
};
