import { TripsModel } from "@bikairproject/lib-manager";

export const getUnpaidTrip = async (userId: number) => {
    try {
        const trip = await TripsModel.findOne({
            where: {
                user_id: userId,
                status: ["PAYMENT_HOLD_CONFIRM", "PAYMENT_FAILED", "PAYMENT_INV_CREATED", "WAIT_VALIDATION"]
            }
        });

        if (trip) {
            return {
                statusCode: 200,
                result: {
                    uuid: trip.uuid,
                    status: trip.status
                }
            };
        } else {
            return {
                statusCode: 203
            };
        }
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
