import {EMAIL_ALERT, EMAIL_APP, MICROSERVICE_NOTIFICATION} from "./config/config";
import {invokeAsync} from "@bikairproject/lambda-utils";
import {
    BatteriesModel, BatteryHistoryModel,
    BIKE_STATUS,
    BikePositionHistoryModel,
    BikesModel,
    CitiesModel,
    findLast5PositionIn5Minutes,
    findNearestSpot,
    GeoUtils, nearByCity, Point,
    TrackersModel,
    VoltagesModel} from "@bikairproject/lib-manager";

const FULL_CAPACITY = 70;
const ORIGIN = "MQ";

export const updateTrackerEvents = async (tracker: TrackersModel, data: any) => {
    if (typeof data.event?.key !== "undefined") {
        console.log("UPDATE EVENT");
        console.log("Updating event...");
        await TrackersModel.update({
            event: data.event.key.toUpperCase(),
            origin: ORIGIN
        }, {
            where: {
                id: tracker.id
            }
        });
    }
};
export const assignBikeToCitySpot = async (tracker: TrackersModel, data: any) => {
    if (typeof data.tracker?.loc?.geo?.coordinates !== "undefined" && tracker.bike_id) {
        // 1. Get bikes current coordinates
        const lat = data.tracker.loc.geo.coordinates[1];
        const lng = data.tracker.loc.geo.coordinates[0];

        // 2. Find nearest spot .
        const spot = await findNearestSpot(lat, lng);
        console.log("Spot: ", spot);
        // 3. Set spots id to bikes
        await BikesModel.update(
            {
                spot_id: spot?.id ?? null
            },
            {
                where: {
                    id: tracker.bike_id
                }
            }
        );
    }
};

export const assignBikeToCity = async (tracker: TrackersModel, data: any) => {
    if (typeof data.tracker?.loc?.geo?.coordinates !== "undefined" && tracker.bike_id) {
        // 1. Get bikes current coordinates
        const lat = data.tracker.loc.geo.coordinates[1];
        const lng = data.tracker.loc.geo.coordinates[0];

        // 2. Find nearest city .
        const city = await nearByCity(lat, lng);
        console.log("City: ", city);
        if(city && city.id){
            // 3. Set city id to bikes
            await BikesModel.update(
                {
                    city_id: city?.id
                },
                {
                    where: {
                        id: tracker.bike_id
                    }
                }
            );
        } else {
            console.log("Assign default city to the bike !");
            const cityWorkshop = await CitiesModel.findOne({where : {name : "Atelier"}});
            if(cityWorkshop && cityWorkshop.id){
                await BikesModel.update({ city_id: cityWorkshop?.id},{ where: { id: tracker.bike_id }});
            }
        }
    }
};

export const updateTrackerPosition = async (tracker: TrackersModel, data: any) => {
    if (typeof data.tracker?.loc?.geo?.coordinates !== "undefined") {
        console.log("UPDATE TRACKER COORDINATES");

        const newLat = data.tracker.loc.geo.coordinates[1];
        const newLng = data.tracker.loc.geo.coordinates[0];
        const lat = tracker.coordinates.coordinates[1];
        const lng = tracker.coordinates.coordinates[0];

        console.log(`Update tracker tracker_coords ${tracker.id} position [${newLat},${newLng}]`);
        await TrackersModel.update({
            tracker_coords: {
                type: "Point",
                coordinates: [newLng, newLat]
            }
        }, {
            where: {
                id: tracker.id
            }
        });

        let bike: BikesModel | null | undefined;
        if (tracker.bike_id) {
            bike = await BikesModel.findByPk(tracker.bike_id);
        }

        let address: string | undefined;
        let coordAddress: Point | undefined;
        try {
            if (bike) {
                let canUpdateAddress = true;
                if (bike.coord_address?.coordinates) {
                    const distFromLastAddressUpdate = GeoUtils.getDistanceFromLatLonInKm(newLat, newLng, bike.coord_address.coordinates[1], bike.coord_address.coordinates[0]);
                    console.log(`Distance from last address update = ${distFromLastAddressUpdate}`);
                    canUpdateAddress = distFromLastAddressUpdate > 0.02;
                } else {
                    console.log("No bike address coordinates");
                }
                if (canUpdateAddress) {
                    address = await GeoUtils.reverseGeo(newLat, newLng);
                    if (address === "NONE") {
                        address = undefined;
                    }
                } else {
                    console.log("no necessity to update address");
                }
            } else {
                console.log("No bikes");
            }
        } catch (error) {
            console.log("Error while reverse geocoding");
            console.log(error);
        }
        console.log("Address = ", address);
        if (typeof address !== "undefined") {
            coordAddress = {
                type: "Point",
                coordinates: [newLng, newLat],
            };
        }

        const distFromLastPosition = GeoUtils.getDistanceFromLatLonInKm(newLat, newLng, lat, lng);
        if (typeof data.tracker?.metric?.moving !== "undefined" && tracker.bike_id) {
            console.log(`Updating bike id : ${tracker.bike_id}`);
            await BikesModel.update(
                {
                    is_moving: data.tracker.metric.moving,
                    address: address,
                    coord_address: coordAddress,
                },
                {
                    where: {
                        id: tracker.bike_id
                    }
                }
            );
        }

        console.log(`Distance from last position = ${distFromLastPosition}`);
        if (distFromLastPosition > 0.02) {
            console.log(`Update tracker coordinates ${tracker.id} position [${newLat},${newLng}] from ${ORIGIN}`);
            await TrackersModel.update({
                coordinates: {
                    type: "Point",
                    coordinates: [newLng, newLat]
                },
                origin: ORIGIN
            }, {
                where: {
                    id: tracker.id
                }
            });

            /** @description we need to create an history of the bike position only if the bike is moving and the status is available */
            if (bike) {
                console.log("CREATE POSITION HISTORY");
                await BikePositionHistoryModel.create({
                    bike_id: bike.id,
                    status: bike.status,
                    origin: ORIGIN,
                    distance: Math.floor(distFromLastPosition * 1000),
                    coordinates: {
                        type: "Point",
                        coordinates: [newLng, newLat]
                    }
                });

                if ((bike.status === BIKE_STATUS.AVAILABLE || bike.status === BIKE_STATUS.BOOKED)) {
                    console.log("FETCH LAST 5 POSITION IN LAST 5 MINUTES");
                    const positions = await findLast5PositionIn5Minutes(bike.id);
                    if (positions.length > 5) {
                        await sendAlertMail(bike, newLat, newLng);
                    }
                }
            }
        }
    }
};
export const updateBatteryLevel = async (tracker: TrackersModel, data: any) => {
    if (
        typeof data.device?.metric?.bmv !== "undefined" &&
        data.device.metric.bmv !== 0 && tracker.bike_id
    ) {
        console.log("UPDATE BATTERY");
        const volts = Math.floor(data.device.metric.bmv * 10) / 10;
        const voltage = await VoltagesModel.findOne({
            where: {
                volts: volts
            }
        });
        console.log("Voltage : ", voltage);
        if (voltage) {
            const capacity = (voltage.km * FULL_CAPACITY) / 100;
            console.log(`Capacity : ${capacity}`);
            await BatteriesModel.update({
                soc: Math.floor(voltage.km),
                voltage: voltage.volts,
                capacity: Math.floor(capacity)
            }, {
                where: {
                    bike_id: tracker.bike_id,
                    status: "ACTIVE"
                }
            });

            const bike = await BikesModel.findByPk(tracker.bike_id);
            if(bike && bike.name === "204") {
                const updatedBattery = await BatteriesModel.findOne({
                    where: {
                        bike_id: tracker.bike_id,
                        status: "ACTIVE"
                    }
                });
                if (updatedBattery) {
                    await BatteryHistoryModel.create({
                        battery_id: updatedBattery.id,
                        full_capacity: updatedBattery.full_capacity,
                        capacity: updatedBattery.capacity,
                        voltage: updatedBattery.voltage,
                        soc: updatedBattery.soc,
                        is_charging: updatedBattery.is_charging,
                        serial: updatedBattery.serial,
                        status: updatedBattery.status,
                    });
                }
            }


            // if (voltage.volts < 32) {
            //     const bike = await BikesModel.findByPk(tracker.bike_id);
            //     if(bike) {
            //         const tags = bike.tags.filter(t => t !== BIKE_TAGS.BATTERY_LOW);
            //         tags.push(BIKE_TAGS.BATTERY_LOW);
            //         await BikesModel.update({
            //             status: BIKE_STATUS.MAINTENANCE,
            //             tags: tags
            //         }, {
            //             where: {
            //                 id: tracker.bike_id
            //             }
            //         });
            //     }
            // }
        }
    }
};
export const sendAlertMail = async (bike: BikesModel, lat: number, lng: number) => {
    console.log("SEND AN ALERT EMAIL");
    const payload = {
        from: EMAIL_APP,
        to: EMAIL_ALERT,
        subject: "ALERT VELO : " + bike.name,
        html: `<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Support</title>
				</head>
				<body>
				<p>
					- Velo: ${bike.name}<br />
					- Adresse: ${bike.address}<br />
					- En movement : ${bike.is_moving ? "Oui" : "Non"}<br />
					- Lat: ${lat}<br />
					- Lng: ${lng}<br />
				</p>
				</body>
				</html>`
    };
    await invokeAsync(MICROSERVICE_NOTIFICATION, payload);
};
