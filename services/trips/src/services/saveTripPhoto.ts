import {BikesModel, checkArea, TripsModel, UsersModel} from "@bikairproject/lib-manager";
import { CityArea,mailPhotoTrip, mailReportPendingValidation, Point, PostSaveTripPhotoInput } from "@bikairproject/lib-manager";

const getLat = (body: PostSaveTripPhotoInput, trip: TripsModel) => {
    if (body.lat) {
        return body.lat;
    }
    if (trip.end_coords) {
        return trip.end_coords.coordinates[1];
    }
    if (trip.start_coords) {
        return trip.start_coords.coordinates[1];
    }
    return null;
};
const getLng = (body: PostSaveTripPhotoInput, trip: TripsModel) => {
    if (body.lng) {
        return body.lng;
    }
    if (trip.end_coords) {
        return trip.end_coords.coordinates[0];
    }
    if (trip.start_coords) {
        return trip.start_coords.coordinates[0];
    }
    return null;
};

export const saveTripPhoto = async (userId: number, body: PostSaveTripPhotoInput, locale: string) => {
    try {
        if (!body.fileName) {
            console.log("No file name in body");
            return {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }

        let trip: TripsModel | null;
        if (body.trip) {
            trip = await TripsModel.findOne({
                where: {
                    uuid: body.trip
                }
            });
        } else {
            trip = await TripsModel.findOne({
                where: {
                    user_id: userId
                },
                order: [["id", "DESC"]]
            });
        }

        if (!trip) {
            console.log(`No trip found for user ${userId}`);
            return {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
        }

        if (body.validation) {
            await TripsModel.update({
                validation_photo: body.fileName
            }, {
                where: {
                    id: trip.id
                }
            });
            trip.validation_photo = body.fileName;
        } else {
            await TripsModel.update({
                end_photo: body.fileName
            }, {
                where: {
                    id: trip.id
                }
            });
            trip.end_photo = body.fileName;
        }

        const user = await UsersModel.findByPk(userId);

        let bike: BikesModel | null;
        if (body.bike) {
            bike = await BikesModel.findOne({
                where: {
                    name: body.bike
                }
            });
        } else {
            bike = await BikesModel.findByPk(trip.bike_id);
        }

        const lat = getLat(body, trip);
        const lng = getLng(body, trip);
        let city: CityArea | null = null;
        if (lat && lng) {
            city = await checkArea(lat, lng);
        }

        const type = body.validation ? "Validation" : "Fin";
        await mailPhotoTrip(user, bike, trip, lat, lng, city?.name, body.fileName, type);
        if (body.validation && bike && user) {
            const point: Point = {
                type: "Point",
                coordinates: [lng ?? 0, lat ?? 0]
            };
            const duration = Math.floor((Date.now() - Number(trip?.time_end ?? Date.now())) / 1000 / 60) + 1;
            await mailReportPendingValidation(bike, user, point, body.fileName, duration);
        }

        return {
            statusCode: 203
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
