import {GOOGLE_GEOCODING_API_KEY} from "../config/config";
import {GoogleMaps} from "@bikairproject/google-api";
import {BikesModel, checkArea, GeoUtils,Point, PutBikesPositionInput , TrackersModel} from "@bikairproject/lib-manager";


export const updateBikesPosition = async (bikeId: number, body: PutBikesPositionInput) => {
    try {
        const { lat, lng } = body;

        if (!lat || !lng) {
            console.log("Missing required params");
            return {
                statusCode: 409,
                result: "Missing required params"
            };
        }

        const bike = await BikesModel.findByPk(bikeId);
        if (bike) {
            const tracker = await TrackersModel.findByPk(bike.tracker_id);
            if (tracker) {
                const trackLat = tracker.tracker_coords?.coordinates[1];
                const trackLng = tracker.tracker_coords?.coordinates[0];

                let distance = 100;
                if (!!trackLat && !!trackLng) {
                    distance = GeoUtils.getDistanceFromLatLonInKm(lat, lng, trackLat, trackLng);
                }

                console.log(`distance = ${distance}`);
                if (distance < 0.03) {
                    let address = await GeoUtils.reverseGeo(lat, lng);
                    if (address === "NONE") {
                        try {
                            const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                            address = await googleGeoCode.getAddress(lat, lng);
                        } catch (error: any) {
                            console.log(error);
                        }
                    }
                    const city = await checkArea(lat, lng);
                    const cityIdMayBe = city ? { city_id: city.id } : {};
                    const point: Point = { type: "Point", coordinates: [lng, lat] };
                    const addressMaybe = address === "NONE" ? {} : { address: address, coord_address: point };

                    await BikesModel.update({
                        ...cityIdMayBe,
                        ...addressMaybe
                    }, {
                        where: {
                            id: bike.id
                        }
                    });

                    await TrackersModel.update({
                        coordinates: point,
                        origin: "MOBILE"
                    }, {
                        where: {
                            id: tracker.id
                        }
                    });
                }
            }

            const updatedBike = await BikesModel.findByPk(bikeId);

            return {
                statusCode: 200,
                result: updatedBike
            };
        } else {
            return {
                statusCode: 409,
                result: "Le tracker ne recense pas une position suffisament proche."
            };
        }
    } catch (error) {
        console.log("[ERROR] Body : ", body);
        console.log("[ERROR] BikeId : ", bikeId);
        throw error;
    }
};
