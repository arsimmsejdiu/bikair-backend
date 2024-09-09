import { AXA_UUID_LOCK_CHAR, AXA_UUID_SERVICE, AXA_UUID_STATE_CHAR } from "../config/config";
import { BIKE_STATUS, BikesModel, BOOKING_STATUS,BookingsModel, closeExpiredBookings, getRentalEnd,LocksModel, TrackersModel  } from "@bikairproject/lib-manager";

export const getBikesAvailability = async (locale: string, userId: number, bikeName: string, origin: string) => {
    try {
        await closeExpiredBookings(userId, origin);

        const bike = await BikesModel.findOne({
            where: {
                name: bikeName
            }
        });

        if (!bike) {
            console.warn(`Bike ${bikeName} not found`);
            return {
                statusCode: 400,
                result: "BIKE_NOT_FOUND"
            };
        }

        let isBikeAvailable = false;
        let message = "";
        if (bike.status === BIKE_STATUS.AVAILABLE) {
            isBikeAvailable = true;
        } else if (bike.status === BIKE_STATUS.BOOKED) {
            const booking = await BookingsModel.findOne({
                where: {
                    bike_id: bike.id,
                    status: BOOKING_STATUS.OPEN
                }
            });
            isBikeAvailable = booking !== null && booking.user_id === userId;
            message = !isBikeAvailable ? "BOOKING_ALREADY_CREATED": ""; 
            if (!booking) {
                console.warn(`Booking already exist for bike id ${bike.id} and is not for user ${userId}.`);
            }
        } else if (bike.status === BIKE_STATUS.RENTAL) {
            const rental = await getRentalEnd(userId);
            console.log(rental);
            console.log(Date.now());
            console.log(new Date(rental ?? 0));
            console.log(new Date());
            isBikeAvailable = rental !== null && rental > Date.now();
            message = !isBikeAvailable ? "BIKE_ALREADY_RENTED": ""; 
        } else {
            console.warn(`Bike ${bikeName} is not AVAILABLE nor BOOKED nor RENTAL.`);
            isBikeAvailable = false;
            message = "BIKE_UNAVAILABLE";
        }

        if(!isBikeAvailable){
            return {
                statusCode: 400,
                result: message
            };
        }

        const tracker = await TrackersModel.findByPk(bike.tracker_id);
        const lock = await LocksModel.findByPk(bike.lock_id);

        return {
            statusCode: 200,
            result: {
                id: bike.id,
                uuid: bike.uuid,
                name: bike.name,
                address: bike.address,
                coordinates: tracker?.coordinates.coordinates,
                serviceUUID: AXA_UUID_SERVICE,
                characteristicUUID: AXA_UUID_LOCK_CHAR,
                stateUUID: AXA_UUID_STATE_CHAR,
                lock_name: `AXA:${(lock?.uid ?? "").toUpperCase()}`,
                lock_uuid: lock?.uuid,
                lock_id: lock?.id
            }
        };
    } catch (error) {
        console.log("[ERROR] locale : ", locale);
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] bikeName : ", bikeName);
        throw error;
    }
};
