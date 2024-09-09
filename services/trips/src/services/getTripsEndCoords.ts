import {GetTripsEndCoords} from "../dao/GetTripsEndCoords";
import {GetTripsEndCoordsOutput} from "@bikairproject/lib-manager";

export const getTripsEndCoords = async () => {
    console.log("Fetching points.");
    const trips = await GetTripsEndCoords();

    console.log("Return n elements : ", trips.length);

    const result: GetTripsEndCoordsOutput = trips.map(t => {
        return {
            coordinates: [t.coordinates.coordinates[0], t.coordinates.coordinates[1]]
        };
    });

    console.log("Result serialized");

    return {
        statusCode: 200,
        result: result
    };
};
