import {GetOpenTrip} from "../dao/GetOpenTrip";
import {getTripReductionFromTrip} from "./computePrice";

export const getTripReduction = async (userId: number) => {
    const trip = await GetOpenTrip(userId);

    if (!trip) {
        return {
            statusCode: 404,
            result: null
        };
    }
    const tripReduction = await getTripReductionFromTrip(trip);
    console.log("Get Trip reduction --> ", trip);
    console.log("Trip reduction : ", tripReduction);

    return {
        statusCode: 200,
        result: tripReduction
    };
};
