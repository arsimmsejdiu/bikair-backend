import { AXA_UUID_LOCK_CHAR, AXA_UUID_SERVICE, AXA_UUID_STATE_CHAR } from "../config/config";
import { GetOpenTrip } from "../dao/GetOpenTrip";


export const getCurrentTrip = async (userId: number) => {
    try {
        const openTrip = await GetOpenTrip(userId);

        if (openTrip) {
            return {
                statusCode: 200,
                result: {
                    uuid: openTrip.uuid,
                    status: openTrip.status,
                    last_status: openTrip.list_status,
                    time_end: Number(openTrip.time_end),
                    time_start: Number(openTrip.time_start),
                    duration: openTrip.duration,
                    bike_id: openTrip.bike_id,
                    bike_name: openTrip.bike_name,
                    serviceUUID: AXA_UUID_SERVICE,
                    characteristicUUID: AXA_UUID_LOCK_CHAR,
                    stateUUID: AXA_UUID_STATE_CHAR,
                    lock_uuid: openTrip.lock.lock_uuid,
                    lock_id: openTrip.lock.lock_id,
                    lock_state: openTrip.lock.state ?? undefined,
                    lock_name: `AXA:${(openTrip?.lock?.lock_uid ?? "").toUpperCase()}`
                }
            };
        } else {
            return {
                statusCode: 200,
                result: null
            };
        }
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
