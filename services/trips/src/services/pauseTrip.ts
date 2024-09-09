import {GOOGLE_GEOCODING_API_KEY} from "../config/config";
import {GoogleMaps} from "@bikairproject/google-api";
import {BikesModel, checkArea, CitiesModel, TripsModel, UsersModel} from "@bikairproject/lib-manager";
import { mailPauseTrip } from "@bikairproject/lib-manager";
import { TRIP_STATUS } from "@bikairproject/lib-manager";
import { GeoUtils } from "@bikairproject/lib-manager";

export const pauseTrip = async (userId: number, body: any) => {
    try {
        const user = await UsersModel.findByPk(userId);
        const trip = await TripsModel.findOne({
            where: {
                user_id: userId,
                status: TRIP_STATUS.OPEN
            }
        });
        const bike = await BikesModel.findByPk(trip?.bike_id);
        let address = await GeoUtils.reverseGeo(body.lat, body.lng);
        if (address === "NONE" && GOOGLE_GEOCODING_API_KEY) {
            try {
                const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                address = await googleGeoCode.getAddress(body.lat, body.lng);
            } catch (error: any) {
                console.log(error);
            }
        }
        const cityArea = await checkArea(body.lat, body.lng);
        let cityName = "Unknown";
        if(cityArea) {
            cityName = cityArea.name;
        } else {
            if(trip?.city_id) {
                const city = await CitiesModel.findByPk(trip.city_id);
                cityName = city?.name ?? "Unknown";
            }
        }

        const args = {
            lat: body.lat,
            lng: body.lng,
            address: address,
            city: cityName
        };

        // Email trip info to admin
        await mailPauseTrip(user, bike, trip, args);

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
