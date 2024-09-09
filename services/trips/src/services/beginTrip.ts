import {
    AXA_UUID_LOCK_CHAR,
    AXA_UUID_SERVICE,
    AXA_UUID_STATE_CHAR,
    GOOGLE_GEOCODING_API_KEY,
    INIT_PRICE_TRIP
} from "../config/config";
import {CancelStartingTrips} from "../dao/CancelStartingTrips";
import {FindOneTrip} from "../dao/FindOneTrip";
import {GoogleMaps} from "@bikairproject/google-api";
import {
    BatteriesModel,
    BikesModel,
    BookingsModel, checkArea,
    CitiesModel,
    getRentalEnd,
    getSequelize,
    TrackersModel,
    TripsModel,
    TripStatusModel,
    updateBikeStatus,
    UsersModel
} from "@bikairproject/lib-manager";
import {mailCancelTrip, mailStartTrip} from "@bikairproject/lib-manager";
import {
    BIKE_STATUS,
    BOOKING_STATUS,
    Cities,
    CityArea,
    Point,
    PostBeginTripInput,
    Trackers,
    TRIP_STATUS,
    TripOutputWithLock
} from "@bikairproject/lib-manager";
import {generateReferenceTrip, GeoUtils} from "@bikairproject/lib-manager";

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
    try {

        if (!body.bike_name) {
            console.log("Missing bike_name parameter");
            await transaction.commit();
            return {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }

        const hasTripAwaitForValidation = await TripsModel.findOne({
            where: {
                status: TRIP_STATUS.WAIT_VALIDATION,
                user_id: userId
            },
            transaction: transaction
        });
        if (hasTripAwaitForValidation) {
            console.log("User has a trip waiting for validation");
            await transaction.commit();
            return {
                statusCode: 400,
                result: "NOT_ALLOWED_WAITING_FOR_VALIDATION"
            };
        }

        const user = await UsersModel.findByPk(userId, {transaction});
        if (!user || user.is_block) {
            console.log(`User ${userId} is blocked`);
            await transaction.commit();
            return {
                statusCode: 400,
                result: "BLOCKED_USER"
            };
        }

        let city: CityArea | null = null;
        let address: string | null = null;
        if (!!body.lat && !!body.lng) {
            city = await checkArea(body.lat, body.lng, transaction);
            address = await GeoUtils.reverseGeo(body.lat, body.lng);
            if (address === "NONE" && GOOGLE_GEOCODING_API_KEY) {
                try {
                    const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                    address = await googleGeoCode.getAddress(body.lat, body.lng);
                } catch (error: any) {
                    console.log(error);
                }
            }
        }

        const bikeName = body.bike_name.trim().toUpperCase();
        const bike = await BikesModel.findOne({
            where: {
                name: bikeName
            },
            transaction: transaction
        });
        if (!bike) {
            console.log(`Bike ${bikeName} not found.`);
            await transaction.commit();
            return {
                statusCode: 404,
                result: "BIKE_UNAVAILABLE"
            };
        }
        if (bike.status !== BIKE_STATUS.AVAILABLE && bike.status !== BIKE_STATUS.BOOKED && bike.status !== BIKE_STATUS.RENTAL) {
            await transaction.commit();
            return {
                statusCode: 404,
                result: "BIKE_UNAVAILABLE"
            };
        }

        const battery = await BatteriesModel.findByPk(bike.battery_id, {transaction: transaction});

        // Ensure the booked bike belong to the current user
        if (bike.status === BIKE_STATUS.BOOKED) {
            console.log("Checking booking information...");
            const booking = await BookingsModel.findOne({
                where: {
                    bike_id: bike.id,
                    status: BOOKING_STATUS.OPEN
                },
                transaction: transaction
            });
            if (booking) {
                if (booking.user_id === user.id) {
                    console.log(`Closing booking ${booking.id}.`);
                    await BookingsModel.update({
                        status: BOOKING_STATUS.CLOSED
                    }, {
                        where: {
                            id: booking.id
                        },
                        transaction: transaction
                    });
                    await updateBikeStatus(bike.id, BIKE_STATUS.AVAILABLE, origin, userId, null, transaction);
                } else {
                    console.log(`Bike ${bikeName} is already booked.`);
                    await transaction.commit();
                    return {
                        statusCode: 404,
                        result: "BIKE_ALREADY_BOOKED"
                    };
                }
            } else {
                await updateBikeStatus(bike.id, BIKE_STATUS.AVAILABLE, origin, userId, null, transaction);
            }
        }

        if (bike.status === BIKE_STATUS.RENTAL) {
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
            await mailCancelTrip(user, cancelBike, tracker, battery, trip, cancelCity, "Nouveau début de trajet");
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
            start_address: address,
            user_id: userId,
            bike_id: bike.id,
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

        await TripStatusModel.create({
            status: TRIP_STATUS.STARTING,
            trip_id: trip.id
        }, {
            transaction: transaction
        });
        const createdTrip: TripOutputWithLock | null = await FindOneTrip(trip.id, transaction);

        await transaction.commit();

        // Email trip info to admin
        await mailStartTrip(user, battery, bike, createdTrip, city);

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
