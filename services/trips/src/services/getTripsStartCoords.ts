import {GetTripsStartCoords} from "../dao/GetTripsStartCoords";
import {GetTripsStartCoordsOutput} from "@bikairproject/lib-manager";

export const getTripsStartCoords = async () => {
    console.log("Fetching points.");
    const trips = await GetTripsStartCoords();

    console.log("Return n elements : ", trips.length);
    
    const result: GetTripsStartCoordsOutput = trips.map(t => {
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
