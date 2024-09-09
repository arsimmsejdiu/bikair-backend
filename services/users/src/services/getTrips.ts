import { GetUserTrips } from "../dao/GetUserTrips";

/**
 *
 * @returns
 */
export const getTrips = async (userId: number) => {
    try {
        const trips = await GetUserTrips(userId);
        console.log(`Found ${trips.length} trips.`);

        return {
            statusCode: 200,
            result: trips
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
