import {GOOGLE_GEOCODING_API_KEY} from "../config/config";
import {mailLockNotif} from "./email";
import {GoogleMaps} from "@bikairproject/google-api";
import {AdminsModel,BikesModel,GeoUtils, PostNotifyLockChangeInput} from "@bikairproject/lib-manager";

const notifyLockChange = async (adminId: number, body: PostNotifyLockChangeInput) => {
    try {
        const admin = await AdminsModel.findByPk(adminId);

        if (!admin) {
            return {
                statusCode: 404,
                result: "Not found"
            };
        }

        let bike: BikesModel | null = null;
        if (body.bikeId) {
            bike = await BikesModel.findByPk(body.bikeId);
        } else if (body.bike_uuid) {
            bike = await BikesModel.findOne({
                where: {
                    uuid: body.bike_uuid
                }
            });
        }

        let address = await GeoUtils.reverseGeo(body.lat, body.lng);
        if (address === "NONE") {
            try {
                const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                address = await googleGeoCode.getAddress(body.lat, body.lng);
            } catch (error: any) {
                console.log(error);
            }
        }
        await mailLockNotif(
            admin,
            bike,
            address,
            body.action
        );

        return {
            statusCode: 200
        };
    } catch (error) {
        console.log("[ERROR] adminId: ", adminId);
        console.log("[ERROR] body: ", body);
        throw error;
    }
};

export default notifyLockChange;
