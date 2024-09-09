import {deleteCityPolygon} from "../services/deleteCityPolygon";
import {
    DeleteCityPolygonInput,
    DeleteCityPolygonOutput,
    HandlerWithTokenAuthorizerBuilder
} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<DeleteCityPolygonInput, DeleteCityPolygonOutput>(async request => {
    const cityId = Number(request.event.pathParameters?.city_id);

    if (Number.isNaN(cityId)) {
        return {
            statusCode: 400,
            result: "Missing Parameters"
        }
    }

    return await deleteCityPolygon(cityId)
})
