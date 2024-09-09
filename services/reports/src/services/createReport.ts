import {GOOGLE_GEOCODING_API_KEY} from "../config/config";
import {GoogleMaps} from "@bikairproject/google-api";
import {AdminsModel,BikesModel, checkArea, CitySpotsModel, GeoUtils, mailReportBike, Point, PostReportInput ,ReportsModel} from "@bikairproject/lib-manager";

export const createReport = async (userId: number, body: PostReportInput) => {
    try {
        const bike = await BikesModel.findOne({
            where: {
                name: body.bike_name
            }
        });

        if (!bike) {
            console.log(`Bike ${body.bike_name} not found.`);
            return {
                statusCode: 200,
                result: "Bike not found."
            };
        }

        const admin = await AdminsModel.findByPk(userId);

        if (!admin) {
            console.log(`Admin ${userId} not found.`);
            return {
                statusCode: 404,
                result: "Not found."
            };
        }

        const {
            incidents,
            comment,
            spot,
            battery_changed,
            pick_up,
            workshop,
            photos,
            lat,
            lng,
            part_repaired,
            transcripts
        } = body;
        const point: Point = { type: "Point", coordinates: [lng, lat] };

        const citySpot = await CitySpotsModel.findByPk(spot?.id);

        const report = await ReportsModel.create({
            part_repaired: part_repaired,
            incidents: incidents,
            bike_id: bike.id,
            comment: comment,
            spot_id: citySpot?.id ?? null,
            battery_changed: battery_changed,
            pick_up: pick_up,
            workshop: workshop,
            admin_id: admin.id,
            coordinates: point,
            photos: photos,
            transcripts: transcripts,
            bike_status: bike.status,
            bike_tags: bike.tags
        });

        // Send an email report
        let location, city;
        try {
            location = await GeoUtils.reverseGeo(lat, lng);
            if (location === "NONE" && GOOGLE_GEOCODING_API_KEY) {
                try {
                    const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                    location = await googleGeoCode.getAddress(lat, lng);
                } catch (error: any) {
                    console.log(error);
                }
            }
            city = await checkArea(lat, lng);
        } catch (error) {
            console.log("Error lors de la récupération de la location reverse geocoding");
            console.log(error);
        }

        await mailReportBike(
            admin,
            bike,
            report,
            citySpot,
            city?.name || "Out of Zone",
            location ?? "NONE",
            photos
        );

        console.log("Mail sent.");
        return {
            statusCode: 200,
            result: report
        };
    } catch (error) {
        console.log("[ERROR] adminId : ", userId);
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
