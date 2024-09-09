import { BatteriesModel, BikesModel, CitiesModel, TrackersModel, TripsModel, TripStatusModel, UsersModel } from "@bikairproject/lib-manager";
import { mailCancelTrip } from "@bikairproject/lib-manager";
import { PutCancelTripInput, TRIP_STATUS } from "@bikairproject/lib-manager";

/**
 *
 * @param userId
 * @param body
 * @param locale
 * @returns
 */
export const cancelTrip = async (userId: number, body: PutCancelTripInput, locale: string) => {
    try {
        const cause = body.cause ?? "TRIP_CANCEL";
        const trip = await TripsModel.findOne({
            where: {
                user_id: userId,
                status: TRIP_STATUS.STARTING
            }
        });
        if (!trip) {
            console.log(`No starting trip for user ${userId}`);
            return {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
        }

        console.log(`Update trip ${trip.id} with status FAILED.`);
        await TripsModel.update({
            status: TRIP_STATUS.CANCEL,
            price: 0
        }, {
            where: {
                id: trip.id
            }
        });
        await TripStatusModel.create({
            trip_id: trip.id,
            status: TRIP_STATUS.CANCEL
        });

        console.log(`Update bike ${trip.bike_id} with status AVAILABLE because of FAILED trip.`);
        await BikesModel.update({
            status: "AVAILABLE"
        }, {
            where: {
                id: trip.bike_id
            }
        });

        const bike = await BikesModel.findByPk(trip.bike_id);
        let tracker: TrackersModel | null = null;
        let battery: BatteriesModel | null = null;
        if (bike) {
            tracker = await TrackersModel.findByPk(bike.tracker_id);
            battery = await BatteriesModel.findByPk(bike.tracker_id);
        }
        let city: CitiesModel | null = null;
        if (trip.city_id) {
            city = await CitiesModel.findByPk(trip.city_id);
        }
        const user = await UsersModel.findByPk(userId);

        // Email trip info to admin
        await mailCancelTrip(user, bike, tracker, battery, trip, city, cause);

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
