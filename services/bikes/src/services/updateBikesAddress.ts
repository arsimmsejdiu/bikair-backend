import {GOOGLE_GEOCODING_API_KEY} from "../config/config";
import {GoogleMaps} from "@bikairproject/google-api";
import {BikesModel, checkArea, GeoUtils, Point, TrackersModel} from "@bikairproject/lib-manager";

const isNewCoordinates = (coord_address: Point | null, coordinates: Point | null) => {
    const coordAddressExist = typeof coord_address !== "undefined" && coord_address != null;
    const coordinatesExist = typeof coordinates !== "undefined" && coordinates != null;

    if (coordAddressExist && coordinatesExist) {
        //if coordinates exist, we check if their are the same
        const oldLat = coord_address?.coordinates[1];
        const oldLng = coord_address?.coordinates[0];
        const lat = coordinates?.coordinates[1];
        const lng = coordinates?.coordinates[0];

        const distance = GeoUtils.getDistanceFromLatLonInKm(oldLat, oldLng, lat, lng);

        return distance > 0.02;
    } else {
        //if one is not set we check address only if we have coordinates and
        //so we have no coord_address
        return coordinatesExist;
    }
};

export const updateBikesAddress = async (bikeId: number) => {
    try {
        const bike = await BikesModel.findByPk(bikeId);
        if (bike) {
            const tracker = await TrackersModel.findByPk(bike.tracker_id);

            if (tracker && isNewCoordinates(bike.coord_address, tracker.coordinates)) {
                const lat = tracker.coordinates.coordinates[1];
                const lng = tracker.coordinates.coordinates[0];
                let address = await GeoUtils.reverseGeo(lat, lng);
                if (address === "NONE") {
                    try {
                        const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                        address = await googleGeoCode.getAddress(lat, lng);
                    } catch (error: any) {
                        console.log(error);
                    }
                }
                if(address !== "NONE") {
                    const city = await checkArea(lat, lng);
                    const cityIdMayBe = city ? { city_id: city.id } : {};

                    const point: Point = { type: "Point", coordinates: [lng, lat] };
                    await BikesModel.update({
                        coord_address: point,
                        address: address,
                        ...cityIdMayBe,
                    }, {
                        where: {
                            id: bike.id
                        }
                    });
                }
            }
        }

        const updatedBike = await BikesModel.findByPk(bikeId);

        return {
            statusCode: 200,
            result: updatedBike
        };
    } catch (error) {
        console.log("[ERROR] BikeId : ", bikeId);
        throw error;
    }
};
