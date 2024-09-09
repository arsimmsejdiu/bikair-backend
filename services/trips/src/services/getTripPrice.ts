import {GetOpenTrip} from "../dao/GetOpenTrip";
import { ComputedPriceOutput } from "../lib/ComputedPriceOutput";
import {computeFinalPrice} from "./computePrice";
import {getSequelize, UsersModel} from "@bikairproject/lib-manager";


export const getTripPrice = async (userId: number, query?: any): Promise<{statusCode: number, result: ComputedPriceOutput | null}> => {
    let timeEnd = Number(query?.time_end);
    if(Number.isNaN(timeEnd)) {
        timeEnd = Date.now();
    }
    try{
        const transaction = await getSequelize().transaction();
        const trip = await GetOpenTrip(userId);
        const user = await UsersModel.findByPk(userId);

        if(!trip || !user) {
            return {
                statusCode: 404,
                result: null
            };
        }

        console.log("Calculate price based on subscription - pass - discount...");
        trip.time_end = timeEnd;
        const price = await computeFinalPrice(trip, transaction);
        await transaction.commit();
        
        return {
            statusCode: 200,
            result: price
        };
    }catch(error){
        console.log("[ERROR-getTripPrice] ", error);
        throw error;
    }
};
