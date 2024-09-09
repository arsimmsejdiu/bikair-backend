import { Transaction } from "sequelize";

import { MICROSERVICE_NOTIFICATION, SLACK_NOTIFICATION } from "../config/config";
import { invokeAsync } from "@bikairproject/lambda-utils";
import { TRIP_STATUS, TripsModel } from "@bikairproject/lib-manager";

export const alertTripCounter = async (user: any, transaction: Transaction) => {
    const last10Trips = await TripsModel.findAll({
        where: {
            user_id: user.id
        },
        order: [["id", "DESC"]],
        transaction: transaction,
        limit: 10
    });
    const count = last10Trips.filter(t => t.status === TRIP_STATUS.FREE_TRIP && (t.discounted_amount ?? 0) > 0).length;
    console.log(`User ${user.id} has ${count} FREE_TRIP in his last 10 trips`);
    if (count > 3) {
        if (MICROSERVICE_NOTIFICATION) {
            await invokeAsync(MICROSERVICE_NOTIFICATION, {
                message: `${user.firstname} ${user.lastname} (${user.id}) à ${count} FREE_TRIP dans ses 10 derniers trajets`,
                type: "alert",
                topic: SLACK_NOTIFICATION
            });
        }
    }
};
