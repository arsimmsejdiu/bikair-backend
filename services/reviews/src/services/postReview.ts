import { firstTripGiftCode } from "./firstTripGiftCode";
import { BIKE_STATUS, BIKE_TAGS, BikesModel, PostReviewInput, TRIP_STATUS, TripReviewsModel, TripsModel, updateBikeStatus } from "@bikairproject/lib-manager";

export const postReview = async (userId: number, body: PostReviewInput, origin: string) => {
    try {
        const trip = await TripsModel.findOne({
            where: {
                user_id: userId,
                status: [TRIP_STATUS.PAYMENT_SUCCESS, TRIP_STATUS.FREE_TRIP, TRIP_STATUS.DISCOUNTED, TRIP_STATUS.PASS, TRIP_STATUS.SUBSCRIPTION, TRIP_STATUS.EXPERIMENTATION]
            },
            order: [["id", "DESC"]]
        });

        if (!trip) {
            return {
                statusCode: 404, result: null
            };
        }

        const { rate, comment, issue } = body;

        const newReview = await TripReviewsModel.create({
            trip_id: trip.id,
            rate: rate,
            comment: comment,
            issue: issue
        });

        const issues = issue ?? [];

        const bike = await BikesModel.findByPk(trip.bike_id);
        if (bike) {
            if (issues.includes("BATTERY")) {
                await updateBikeStatus(bike.id, BIKE_STATUS.MAINTENANCE, origin, userId);
                await BikesModel.update({
                    tags: [...bike.tags, ...[BIKE_TAGS.BATTERY_LOW]]
                }, {
                    where: {
                        id: trip.bike_id
                    }
                });
            }
            if (issues.includes("MECHANICAL")) {
                await BikesModel.update({
                    tags: [...bike.tags, ...[BIKE_TAGS.COLLECT, BIKE_TAGS.CLIENT_REVIEW]]
                }, {
                    where: {
                        id: trip.bike_id
                    }
                });
                const updatedBike = await BikesModel.findByPk(trip.bike_id);
                if(updatedBike){
                    await updateBikeStatus(bike.id, updatedBike.status, origin, userId, BIKE_TAGS.COLLECT);
                }
            }
        }

        await firstTripGiftCode(userId, rate ?? 0);

        return {
            statusCode: 200,
            result: newReview
        };
    } catch (error) {
        console.log("[ERROR] clientId : ", userId);
        console.log("[ERROR] query : ", body);
        throw error;
    }
};
