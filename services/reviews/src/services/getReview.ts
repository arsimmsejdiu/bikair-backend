import {BIKE_TAGS, BikesModel, ReportsModel, TripReviewsModel, TripsModel } from "@bikairproject/lib-manager";

export const getReview = async (bikeId: number) => {
    try {
        const bike = await BikesModel.findByPk(bikeId);

        if (!bike) {
            console.log("Bike not found");
            return {
                statusCode: 404,
                result: "BIKE_NOT_FOUND"
            };
        }

        const trip = await TripsModel.findOne({
            where: {
                bike_id: bikeId
            },
            order: [["id", "DESC"]]
        });
        if (!trip || !trip.id) {
            console.log("No Trip found");
            return {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
        }
        const trip_review = await TripReviewsModel.findOne({
            where: {
                trip_id: trip.id
            },
            order: [["id", "DESC"]]
        });
        const report = await ReportsModel.findOne({
            where: {
                bike_id: bikeId
            },
            order: [["id", "DESC"]]
        });

        let reported = false;
        if (!bike.tags.includes(BIKE_TAGS.CONTROLLED)) {
            console.log("Not Controlled");
            reported = false;
        } else {
            if (!report || !trip_review || trip_review.created_at > report.created_at) {
                reported = false;
            } else {
                reported = true;
            }
        }
        console.log("reported : ", reported);
        if (trip_review && !reported) {
            return {
                statusCode: 200,
                result: trip_review
            };
        } else {
            return {
                statusCode: 200,
                result: null
            };
        }

    } catch (error) {
        console.log("[ERROR] bike_id : ", bikeId);
        throw error;
    }
};
