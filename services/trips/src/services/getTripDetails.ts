import {GetTripDetails} from "../dao/GetTripDetails";

export const getTripDetails = async (id: number) => {
    try {
        const trip = await GetTripDetails(id);

        if (trip === null) {
            return {
                statusCode: 404,
                result: "Not found"
            };
        }

        return {
            statusCode: 200,
            result: trip
        };
    } catch (err) {
        console.log("[ERROR] getTripDetails - id : ", id);
        throw err;
    }
};
