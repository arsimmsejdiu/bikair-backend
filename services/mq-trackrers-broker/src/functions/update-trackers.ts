import { MICROSERVICE_NOTIFICATION } from "../config/config";
import { assignBikeToCity, assignBikeToCitySpot, updateBatteryLevel, updateTrackerEvents, updateTrackerPosition } from "../service";
import { isDtsLessThanOneHour, isHdopValid } from "../validations";
import { invokeAsync } from "@bikairproject/lambda-utils";
import {closeConnection, ErrorUtils, loadSequelize, STATUS, TrackersModel } from "@bikairproject/lib-manager";


export const handler = async (event) => {
    await loadSequelize();

    const messages = event.rmqMessagesByQueue["conneqtech::/"];
    console.log(`Processing-- ${messages.length} messages`);

    for (const message of messages) {
        try {
            const base64 = Buffer.from(message.data, "base64").toString();
            const data = JSON.parse(base64);

            console.log(data);
            if(data.tracker?.loc?.geo?.coordinates) {
                console.log("coordinates: ", data.tracker.loc.geo.coordinates);
            }

            // Validation before saving
            if(data.tracker?.loc?.hdop && !isHdopValid(data.tracker.loc.hdop)) {
                return;
            }
            if(data.dtd && !isDtsLessThanOneHour(data.dtd)) {
                return;
            }

            if (typeof data.imei !== "undefined") {
                console.log("imei defined");
                const tracker = await TrackersModel.findOne({
                    where: {
                        imei: data.imei + "",
                        status: STATUS.ACTIVE
                    },
                });
                if (typeof tracker !== "undefined" && tracker !== null) {
                    console.log("tracker defined");
                    await updateTrackerEvents(tracker, data);

                    await updateTrackerPosition(tracker, data);

                    await updateBatteryLevel(tracker, data);

                    await assignBikeToCitySpot(tracker, data);

                    await assignBikeToCity(tracker, data);
                }
            }
        } catch (error) {
            console.log(
                "Error while processing message. Processing without break."
            );
            const from = "mq-tracker-broker";
            const payload = await ErrorUtils.getSlackErrorPayload(from, error);
            await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
        }
    }

    await closeConnection();
    console.log("Done.");
    return "OK";
};
