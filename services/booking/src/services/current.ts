import {BatteriesModel, BikesModel, BOOKING_STATUS,  BookingsModel, TrackersModel } from "@bikairproject/lib-manager";

export const current = async (userId: number, locale: string) => {
    try {
        console.log(`Searching booking for user ${userId}`);

        const booking = await BookingsModel.findOne({
            where: {
                user_id: userId,
                status: BOOKING_STATUS.OPEN
            }
        });

        if (!booking) {
            console.warn("No booking found.");
            return {
                statusCode: 200,
                result: null
            };
        }
        console.log(`Found booking ${booking.id}`);

        const bike = await BikesModel.findByPk(booking.bike_id);

        if (!bike) {
            return {
                statusCode: 404,
                result: "BIKE_UNAVAILABLE"
            };
        }

        const tracker = await TrackersModel.findByPk(bike.tracker_id);
        const battery = await BatteriesModel.findByPk(bike.battery_id);

        return {
            statusCode: 200,
            result: {
                uuid: booking.uuid,
                expired_at: booking.expired_at,
                name: bike.name,
                address: bike.address,
                coordinates: tracker?.coordinates?.coordinates as [number, number] | undefined,
                capacity: battery?.capacity,
                status: bike.status
            }
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
