import {checkArea, checkRedZoneArea, CityArea, findNearestSpot,PostCheckZoneInput} from "@bikairproject/lib-manager";

export const checkCityZones = async (body: PostCheckZoneInput, locale: string) => {
    try {
        const isInCityRedZone = await checkRedZoneArea(body.lat, body.lng);
        console.log("isInCityRedZone ? ", !!isInCityRedZone);

        if(isInCityRedZone){
            return {
                statusCode: 404,
                result: "end_trip.error_zone"
            };
        }

        const city: CityArea | null = await checkArea(body.lat, body.lng);
        console.log("City ? ", !!city);

        const spot = await findNearestSpot(body.lat, body.lng, true, null);
        console.log("Spot ? ", !!spot);

        if (city?.parking_spot) {
            console.log("We must park on spot");
            if (!spot) {
                console.log("But we are not on spot");
                return {
                    statusCode: 404,
                    result: "end_trip.error_zone"
                };
            } else {
                console.log("And we are on spot");
                return {
                    statusCode: 200,
                    result: city
                };
            }
        } else {
            console.log("We can park where we want in city");
            if (!city) {
                console.log("But we are not in a city");
                return {
                    statusCode: 404,
                    result: "end_trip.error_zone"
                };
            } else if (isInCityRedZone && !spot) {
                console.log("But we are in a red zone, not on spot");
                return {
                    statusCode: 404,
                    result: "end_trip.error_zone"
                };
            } else {
                console.log("And we are in a good place");
                return {
                    statusCode: 200,
                    result: city
                };
            }
        }
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
