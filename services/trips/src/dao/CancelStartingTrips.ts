import Transaction from "sequelize";

import {TRIP_STATUS, TripsModel, TripStatusModel } from "@bikairproject/lib-manager";


export const CancelStartingTrips = async (userId: number, transaction?: Transaction.Transaction) => {
    const trips = await TripsModel.findAll({
        where: {
            status: TRIP_STATUS.STARTING,
            user_id: userId
        },
        transaction: transaction
    });

    await TripsModel.update({
        status: TRIP_STATUS.CANCEL
    }, {
        where: {
            status: TRIP_STATUS.STARTING,
            user_id: userId
        },
        transaction: transaction
    }
    );

    for (const trip of trips) {
        await TripStatusModel.create({
            trip_id: trip.id,
            status: TRIP_STATUS.CANCEL
        }, {
            transaction: transaction
        });

    }

    return trips;
};
