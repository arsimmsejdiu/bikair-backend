import {
    AXA_UUID_LOCK_CHAR,
    AXA_UUID_SERVICE,
    AXA_UUID_STATE_CHAR,
    INIT_PRICE_TRIP
} from "../config/config";
import {CancelStartingTrips} from "../dao/CancelStartingTrips";
import {FindOneTrip} from "../dao/FindOneTrip";
// Validation
import { hasBooking } from "../validation/hasBooking";
import TripData from "../validation/tripData";
import {
    BikesModel,
    checkArea,
    CitiesModel,
    getRentalEnd,
    getSequelize,
    TrackersModel,
    TripsModel
} from "@bikairproject/lib-manager";
import {mailCancelTrip, mailStartTrip} from "@bikairproject/lib-manager";
import {
    BIKE_STATUS,
    Cities,
    CityArea,
    Point,
    PostBeginTripInput,
    Trackers,
    TRIP_STATUS,
    TripOutputWithLock
} from "@bikairproject/lib-manager";
import {generateReferenceTrip} from "@bikairproject/lib-manager";

/**
 *
 * @param userId
 * @param body
 * @param locale
 * @param origin
 * @returns
 */
export const beginTrip = async (userId: number, body: PostBeginTripInput, locale: string, origin: string) => {
    const transaction = await getSequelize().transaction();
    const self = new TripData(body.bike_name, body.lat, body.lng, null, userId, transaction);
    try {

        await self.setBikeByName();
        if(self.error) return self.error;
        await self.setUser();
        if(self.error) return self.error;
        await self.setBattery();

        await self.canBeginTrip();
        if(self.error) return self.error;

        let city: CityArea | null = null;
        if (!!self.lat && !!self.lng) {
            city = await checkArea(self.lat, self.lng, transaction);
            await self.setAddress(self.lat, self.lng);
        }

        if (self.bike.status !== BIKE_STATUS.AVAILABLE && self.bike.status !== BIKE_STATUS.BOOKED && self.bike.status !== BIKE_STATUS.RENTAL) {
            await transaction.commit();
            return {
                statusCode: 404,
                result: "BIKE_UNAVAILABLE"
            };
        }

        // Checking if user has a booking
        await hasBooking(self.bike, userId, origin, transaction);

        if (self.bike.status === BIKE_STATUS.RENTAL) {
            const rental = await getRentalEnd(userId, transaction);
            if (!rental || rental < Date.now()) {
                await transaction.commit();
                return {
                    statusCode: 404,
                    result: "BIKE_ALREADY_RENTED"
                };
            }
        }

        console.log("Canceling previous starting trip");
        const canceledTrips = await CancelStartingTrips(userId, transaction);

        for (const trip of canceledTrips) {
            const cancelBike = await BikesModel.findByPk(trip.bike_id, {transaction: transaction});
            let tracker: Trackers | null = null;
            if (cancelBike) {
                tracker = await TrackersModel.findByPk(cancelBike.tracker_id, {transaction: transaction});
            }
            let cancelCity: Cities | null = null;
            if (trip.city_id) {
                cancelCity = await CitiesModel.findByPk(trip.city_id, {transaction: transaction});
            }
            await mailCancelTrip(self.user, cancelBike, tracker, self.battery, trip, cancelCity, "Nouveau début de trajet");
        }

        // Set unix time_start
        const time_start = new Date().getTime();
        console.log(`Creating a new starting trip at ${time_start}`);
        const cityId = city?.id ?? null;

        const reference = generateReferenceTrip();
        const startCoords: Point = {
            type: "Point",
            coordinates: [body.lng, body.lat]
        };

        const trip = await TripsModel.create({
            start_address: self.address,
            user_id: userId,
            bike_id: self.bike.id,
            price: INIT_PRICE_TRIP,
            time_start: String(time_start),
            status: TRIP_STATUS.STARTING,
            duration: 0,
            reference: reference,
            start_coords: startCoords,
            city_id: cityId,
            trip_deposit_id: null,
            refund_amount: 0
        }, {
            transaction: transaction
        });
        self.trip = trip.dataValues || trip;
        console.log(self.trip);
        await self.createTripStatus(TRIP_STATUS.STARTING);

        const createdTrip: TripOutputWithLock | null = await FindOneTrip(self.trip.id, transaction);

        await transaction.commit();
        
        // Email trip info to admin
        await mailStartTrip(self.user, self.battery, self.bike, createdTrip, city);

        return {
            statusCode: 200,
            result: {
                uuid: createdTrip?.uuid,
                status: createdTrip?.status,
                time_end: Number(createdTrip?.time_end),
                time_start: Number(createdTrip?.time_start),
                duration: createdTrip?.duration,
                serviceUUID: AXA_UUID_SERVICE,
                characteristicUUID: AXA_UUID_LOCK_CHAR,
                stateUUID: AXA_UUID_STATE_CHAR,
                lock_uuid: createdTrip?.lock.lock_uuid,
                lock_state: createdTrip?.lock.state ?? undefined,
                lock_name: `AXA:${(createdTrip?.lock?.lock_uid ?? "").toUpperCase()}`
            }
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        await transaction.rollback();
        throw error;
    }
};
