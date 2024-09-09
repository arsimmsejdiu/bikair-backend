import {AXA_UUID_LOCK_CHAR, AXA_UUID_SERVICE, AXA_UUID_STATE_CHAR, GOOGLE_GEOCODING_API_KEY} from "../config/config";
import {GetOpenTrip} from "../dao/GetOpenTrip";
import {GoogleMaps} from "@bikairproject/google-api";
import {
    BikesModel, checkArea,
    getDiscountForTrip,
    getSequelize,
    RentalsModel,
    TripDepositsModel,
    TripsModel,
    TripStatusModel
} from "@bikairproject/lib-manager";
import {
    BIKE_STATUS,
    PutStartTripInput,
    RENTAL_STATUS,
    STATUS,
    TRIP_REDUCTIONS,
    TRIP_STATUS
} from "@bikairproject/lib-manager";
import {GeoUtils} from "@bikairproject/lib-manager";

export const startTrip = async (userId: number, body: PutStartTripInput, locale: string) => {
    const transaction = await getSequelize().transaction();
    try {
        const time_start = body.time_start ?? new Date().getTime();

        const trip = await TripsModel.findOne({
            where: {
                user_id: userId,
                status: TRIP_STATUS.STARTING
            },
            transaction: transaction
        });
        if (!trip) {
            console.log(`No starting trip found for user ${userId}`);
            const result = {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
            console.log("returning ", result);
            await transaction.commit();
            return result;
        }

        console.log(`Ensure there is a deposit created for user : ${userId}`);
        const deposit = await TripDepositsModel.findOne({
            where: {
                user_id: userId,
                status: STATUS.ACTIVE
            },
            transaction: transaction
        });
        if (!deposit) {
            console.log(`No active deposit found for user ${userId}`);
        }

        console.log(`Updating bike ${trip.bike_id} status to USED`);
        let cityIdMayBe: number | undefined;
        let addressMaybe: string | undefined;
        if (!!body.lat && !!body.lng) {
            let address = await GeoUtils.reverseGeo(body.lat, body.lng);
            if (address === "NONE" && GOOGLE_GEOCODING_API_KEY) {
                try {
                    const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                    address = await googleGeoCode.getAddress(body.lat, body.lng);
                } catch (error: any) {
                    console.log(error);
                }
            }
            const city = await checkArea(body.lat, body.lng);
            cityIdMayBe = city?.id ?? undefined;
            addressMaybe = address ?? undefined;
        }

        await BikesModel.update({
            status: BIKE_STATUS.USED,
            city_id: cityIdMayBe,
            address: addressMaybe
        }, {
            where: {
                id: trip.bike_id
            },
            transaction: transaction
        });

        const tripReduction = await getDiscountForTrip(userId, Number(time_start), transaction);
        console.log("tripReduction = ", tripReduction);
        let discountId: number | null = null;
        let subscriptionId: number | null = null;
        let rentalId: number | null = null;

        if (tripReduction) {
            switch (tripReduction.reductionType) {
                case TRIP_REDUCTIONS.DISCOUNT:
                    discountId = tripReduction.id;
                    break;
                case TRIP_REDUCTIONS.PRODUCT:
                    subscriptionId = tripReduction.id;
                    break;
                case TRIP_REDUCTIONS.RENTAL:
                    rentalId = tripReduction.id;
                    await RentalsModel.update({
                        status: RENTAL_STATUS.USED
                    }, {
                        where: {
                            id: tripReduction.id,
                        },
                        transaction: transaction
                    });
                    break;
            }
        }

        console.log(`Updating trip ${trip.id} with time_start ${time_start} and status 'OPEN'`);
        await TripsModel.update({
            time_start: String(time_start),
            status: TRIP_STATUS.OPEN,
            trip_deposit_id: deposit?.id ?? null,
            city_id: cityIdMayBe,
            start_address: addressMaybe,
            discount_id: discountId,
            user_subscription_id: subscriptionId,
            rental_id: rentalId
        }, {
            where: {
                id: trip.id
            },
            transaction: transaction
        });
        await TripStatusModel.create({
            status: TRIP_STATUS.OPEN,
            trip_id: trip.id
        }, {
            transaction: transaction
        });

        const startedTrip = await GetOpenTrip(userId, transaction);

        await transaction.commit();

        return {
            statusCode: 200,
            result: {
                uuid: startedTrip?.uuid,
                status: startedTrip?.status,
                time_end: Number(startedTrip?.time_end),
                time_start: Number(startedTrip?.time_start),
                duration: startedTrip?.duration,
                serviceUUID: AXA_UUID_SERVICE,
                characteristicUUID: AXA_UUID_LOCK_CHAR,
                stateUUID: AXA_UUID_STATE_CHAR,
                lock_uuid: startedTrip?.lock.lock_uuid,
                lock_state: startedTrip?.lock.state ?? undefined,
                lock_name: `AXA:${(startedTrip?.lock.lock_uid ?? "").toUpperCase()}`
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
