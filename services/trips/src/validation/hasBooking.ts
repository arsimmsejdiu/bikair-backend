import { Transaction } from "sequelize";

import {BIKE_STATUS,Bikes,BOOKING_STATUS , BookingsModel, updateBikeStatus } from "@bikairproject/lib-manager";

export const hasBooking = async  (bike: Bikes, userId: number, origin: string, transaction: Transaction) => {
    if(bike.status === BIKE_STATUS.BOOKED){
        console.log("Checking booking information...");
        const booking = await BookingsModel.findOne({
            where: {
                bike_id: bike.id,
                status: BOOKING_STATUS.OPEN
            },
            transaction: transaction
        });
        if (booking) {
            if (booking.user_id === userId) {
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
                console.log(`Bike ${bike.name} is already booked.`);
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
};
