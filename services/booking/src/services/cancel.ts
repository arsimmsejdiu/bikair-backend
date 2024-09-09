import {BIKE_STATUS, BOOKING_STATUS, BookingsModel, updateBikeStatus } from "@bikairproject/lib-manager";

export const cancel = async (userId: number, origin: string) => {
    try {
        console.log("Canceling a booking...");

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

        await updateBikeStatus(booking.bike_id, BIKE_STATUS.AVAILABLE,  origin, userId);

        await BookingsModel.update({ status: BOOKING_STATUS.CLOSED }, {
            where: {
                id: booking.id
            }
        });

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
