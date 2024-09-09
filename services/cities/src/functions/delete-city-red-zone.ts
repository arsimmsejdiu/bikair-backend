import {deleteCityRedZone} from "../services/deleteCityRedZone";
import {
    DeleteCityRedZoneInput,
    DeleteCityRedZoneOutput,
    HandlerWithTokenAuthorizerBuilder
} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<DeleteCityRedZoneInput, DeleteCityRedZoneOutput>(
    async request => {
        const cityId = Number(request.event.pathParameters?.city_id);

        if (Number.isNaN(cityId)) {
            return {
                statusCode: 400,
                result: "Missing Parameters"
            }
        }

        return await deleteCityRedZone(cityId)
    })
