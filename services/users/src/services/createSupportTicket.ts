import {GOOGLE_GEOCODING_API_KEY} from "../config/config";
import {GoogleMaps} from "@bikairproject/google-api";
import { TripsModel, UsersModel, mailSupport, GeoUtils } from "@bikairproject/lib-manager";

export const createSupportTicket = async (userId: number, body: any) => {
    try {
        const currentUser = await UsersModel.findByPk(userId);
        const trip = await TripsModel.findOne({
            where: {
                status: "OPEN",
                user_id: userId
            },
            order: [["id", "DESC"]]
        });

        let address = await GeoUtils.reverseGeo(body.lat, body.lng);
        if (address === "NONE" && GOOGLE_GEOCODING_API_KEY) {
            try {
                const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                address = await googleGeoCode.getAddress(body.lat, body.lng);
            } catch (error: any) {
                console.log(error);
            }
        }

        await mailSupport(currentUser, trip, body, address);

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
