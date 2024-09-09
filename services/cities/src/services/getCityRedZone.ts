import { CityRedZonesModel } from "@bikairproject/lib-manager";
import {GetCityRedZone} from "../dao/GetCityRedZone";

export const getCityRedZone = async (redZoneId: number) => {
    try {
        const result = await GetCityRedZone(redZoneId)

        if(result === null) {
            return {
                statusCode : 404,
                result: "City red zone not found"
            };
        } else {
            return {
                statusCode: 200,
                result: result
            }
        }
    } catch (error) {
        console.log("[ERROR] cityRedZoneId : ", redZoneId);
        throw error;
    }
};
