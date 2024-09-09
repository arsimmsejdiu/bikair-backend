import {AXA_CLIENT_ID, AXA_CLIENT_SECRET, LATITUDE, LONGITUDE} from "../config/config";
import {getBikeDetail} from "./getBikeDetail";
import {Axa} from "@bikairproject/axa-api";
import {BikesModel, getSequelize, Point, PutBikeTrackerInput, STATUS, TrackersModel} from "@bikairproject/lib-manager";


export const updateBikeTracker = async (body: PutBikeTrackerInput) => {
    const transaction = await getSequelize().transaction();
    try {

        const {bikeId, trackerImei, trackerMac} = body;

        if (!bikeId || !trackerImei || !trackerMac) {
            console.warn("Missing parameters.");
            return {
                statusCode: 409,
                result: "Champs requis manquant."
            };
        }

        const axa = new Axa(AXA_CLIENT_ID, AXA_CLIENT_SECRET);
        await axa.claimTracker(trackerImei);

        await TrackersModel.update({
            status: "INACTIVE"
        }, {
            where: {
                bike_id: bikeId
            }
        });

        await TrackersModel.update({
            imei: "X" + trackerImei + "X"
        }, {
            where: {
                imei: trackerImei,
                status: STATUS.ACTIVE
            }
        });

        const point: Point = {type: "Point", coordinates: [LONGITUDE, LATITUDE]};
        const newTracker = await TrackersModel.create({
            bike_id: bikeId,
            imei: trackerImei,
            mac: trackerMac,
            status: "ACTIVE",
            coordinates: point
        }, {
            transaction: transaction
        });

        await BikesModel.update({
            tracker_id: newTracker.id
        }, {
            where: {
                id: bikeId
            },
            transaction: transaction
        });

        await transaction.commit();

        const bike = await getBikeDetail(bikeId);

        return {
            statusCode: 200,
            result: bike.result
        };
    } catch (error) {
        console.log("[ERROR] Body : ", body);
        await transaction.rollback();
        throw error;
    }
};
