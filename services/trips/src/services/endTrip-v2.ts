import {
    MICROSERVICE_NOTIFICATION,
    MIN_AMOUNT,
    RETURN_URL_PAYMENT,
    SLACK_NOTIFICATION,
} from "../config/config";
import TripData from "../validation/tripData";
import { alertTripCounter } from "../validation/validations";
import {checkGamePlayed} from "./checkGamePlay";
import {checkSpotArea} from "./checkSpotArea";
import {calculateExperimentalPrice, getTripReductionFromTrip, resolveReductionUsage} from "./computePrice";
import {invokeAsync} from "@bikairproject/lambda-utils";
import {
    BatteriesModel, BIKE_TAGS,
    BikesModel,
    checkArea,
    checkRedZoneArea, CitiesModel,
    createBikePosition,
    findFunctionalitiesForCity,
    findNearestSpot,
    getSequelize,
    TrackersModel,
    TripsModel,
    updateCoordinates,
    UsersModel
} from "@bikairproject/lib-manager";
import {mailAlertTrip, mailEndTrip} from "@bikairproject/lib-manager";
import {
    Batteries,
    BIKE_STATUS,
    CityArea,
    Point,
    PROVIDER_INVOICE_TYPE,
    PutEndTripInput,
    Trackers,
    TRIP_REDUCTIONS,
    TRIP_STATUS,
    TripReduction,
    TripsUpdate
} from "@bikairproject/lib-manager";
import {calculTripDuration, computePrice, GeoUtils} from "@bikairproject/lib-manager";
import {mailTripValidation} from "@bikairproject/mailing/dist/functions/TripValidation";


const ORIGIN = "MOBILE_APP";

/**
 *
 * @param userId
 * @param body
 * @param locale
 * @param origin
 * @returns
 */
export const endTrip = async (userId: number, body: PutEndTripInput, locale: string, origin: string, appVersion?: string) => {
    const transaction = await getSequelize().transaction();
    const self = new TripData(null, body.lat || undefined, body.lng || undefined, null, userId, transaction);

    try {
        await self.setUser();
        if(self.error) return self.error;
        await self.setTrip();
        if(self.error) return self.error;
        await self.setBikeById();
        if(self.error) return self.error;
        await self.initStripe();


        appVersion = appVersion ?? self.user.client_version;

        console.log(`body.offline = ${body.offline}`);
        const offline = body.offline ?? false;
        console.log(`offline = ${offline}`);
        console.log(`body.validation = ${body.validation}`);
        const validation = body.validation ?? false;
        console.log(`validation = ${validation}`);
        // We declare variable before try/catch, so we can use it to reset if necessary
        let trueLatLng = true;


        if (!self.lat || !self.lng) {
            const tracker = await TrackersModel.findOne({where: {bike_id: self.bike.id}});
            const lat = tracker?.coordinates?.coordinates[1] ?? self.trip.start_coords?.coordinates[1];
            const lng = tracker?.coordinates?.coordinates[0] ?? self.trip.start_coords?.coordinates[0];
            if (!lat || !lng) {
                await transaction.commit();
                return {
                    statusCode: 400,
                    result: "Malformed request"
                };
            }
            self.setLat(lat);
            self.setLng(lng);
            trueLatLng = false;
        }else{
            self.setLat(body.lat);
            self.setLng(body.lng);
        }

        if (!self.lat || !self.lng) {
            await transaction.commit();
            return {
                statusCode: 400,
                result: "Malformed request"
            };
        }
        await self.setAddress(self.lat, self.lng);

        // Ensure the bike is not inside the redzone
        const isInCityRedZone = await checkRedZoneArea(self.lat, self.lng);
        console.log("isInCityRedZone ? ", !!isInCityRedZone);

        let city: CityArea | null = await checkArea(self.lat, self.lng);
        console.log("City ? ", !!city);

        const spot = await findNearestSpot(self.lat, self.lng, true, null);
        console.log("Spot ? ", !!spot);

        const isNotOnSpotRequired = city?.parking_spot && (typeof spot === "undefined" || spot === null);

        if(city?.parking_spot) {
            console.log("We must park on spot");
            if(!spot) {
                console.log("But we are not on spot");
                await transaction.commit();
                return {
                    statusCode: 400,
                    result: "OUT_OF_ZONE"
                };
            } else {
                console.log("And we are on spot");
            }
        } else {
            console.log("We can park where we want in city");
            if (!city) {
                console.log("But we are not in a city");
                return {
                    statusCode: 400,
                    result: "OUT_OF_ZONE"
                };
            } else if (isNotOnSpotRequired && !spot) {
                console.log("But we are in a red zone, not on spot");
                return {
                    statusCode: 400,
                    result: "OUT_OF_ZONE"
                };
            } else {
                console.log("And we are in a good place");
            }
        }

        // If the bike is in a parking area (spot), then the user get a 10% descount code
        const deviceToken = self.userSettings?.device_token ?? "";

        if(!city && self.user.city_id) {
            city = await CitiesModel.findByPk(self.user.city_id);
        }

        if(!city) {
            return {
                statusCode: 400,
                result: "Malformed request"
            };
        }

        const functionalities = await findFunctionalitiesForCity(city.id, origin, transaction);
        const functionalitiesName = functionalities.map(f => f.name);

        if (trueLatLng) {
            console.log(`Updating bike ${self.bike.id} tracker with user last position [${self.lat},${self.lng}]`);
            // Update tracker with user GPS coords
            await updateCoordinates(self.bike.tracker_id, self.lat, self.lng, ORIGIN, transaction);
            const distFromLastPosition = GeoUtils.getDistanceFromLatLonInKm(self.lat, self.lng, self.lat, self.lng);
            await createBikePosition(self.bike.id, ORIGIN, body.lat, body.lng, distFromLastPosition, transaction);

            console.log(`Updating trip ${self.trip.id} coordinates and address [${self.address}]...`);
            const endCoord: Point = {
                type: "Point",
                coordinates: [self.lng, self.lat]
            };
            await TripsModel.update({
                end_address: self.address,
                city_id: city.id,
                end_coords: endCoord
            }, {
                where: {
                    id: self.trip.id
                },
                transaction: transaction
            });
        }

        const timeEnd = body.time_end ?? new Date().getTime();

        console.log(`Updating trip ${self.trip.id} with status CLOSED...`);
        await TripsModel.update({
            status: TRIP_STATUS.CLOSED,
            time_end: String(timeEnd)
        }, {
            where: {
                id: self.trip.id
            },
            transaction: transaction
        });
        await self.setTrip();
        let updatedTrip = await TripsModel.findByPk(self.trip.id, {transaction: transaction});
        if (!updatedTrip) {
            console.log("Can not find updated trip !");
            return {
                statusCode: 500,
                result: "Server Error"
            };
        }
        await self.createTripStatus(TRIP_STATUS.CLOSED);

        console.log("Calculate price based on subscription - pass - discount...");
        const duration = calculTripDuration(Number(self.trip.time_start), Number(self.trip.time_end ?? "0"));
        console.log("duration : ", duration);
        let tripReduction: TripReduction | null = null;
        tripReduction = await getTripReductionFromTrip(self.trip, transaction);
        console.log("Trip discount : ", tripReduction);
        const finalPrice = computePrice(tripReduction, Number(self.trip.time_start), duration, appVersion !== "4.10.6");
        console.log("finalPrice : ", finalPrice);
        const tripUpdatePrice: TripsUpdate = {
            id: self.trip.id,
            duration: duration,
            price: finalPrice.price,
            discounted_amount: finalPrice.reduction
        };
        if (!tripReduction) {
            tripUpdatePrice.discount_id = null;
            tripUpdatePrice.user_subscription_id = null;
            tripUpdatePrice.rental_id = null;
        }

        if (finalPrice.type !== TRIP_REDUCTIONS.NONE) {
            await self.createTripStatus(finalPrice.type || "TRIP_REDUCTIONS");
        }

        if(duration > 2) {
            console.log(`Updating trip ${self.trip.id} with duration ${duration}, price ${finalPrice.price} and discounted_amount ${finalPrice.price - finalPrice.discounted_amount}`);
            // Update trip price
            await TripsModel.update(tripUpdatePrice, {
                where: {
                    id: self.trip.id
                },
                transaction: transaction
            });
        }
        const tripWithPrice = await TripsModel.findByPk(self.trip.id, {transaction: transaction});
        if (tripWithPrice && !validation && duration > 2) {
            await resolveReductionUsage(finalPrice, tripWithPrice, transaction);
        }

        console.log(`Update bike ${self.bike.id} status to AVAILABLE...`);
        // Ensure you update bike status
        const cityIdMayBe = city?.id ?? undefined;
        const adressMaybe = self.address === "NONE" ? undefined : self.address;
        const bikeStatus = finalPrice.type === TRIP_REDUCTIONS.RENTAL ? BIKE_STATUS.RENTAL : validation ? BIKE_STATUS.USED : BIKE_STATUS.AVAILABLE;


        await BikesModel.update({
            status: bikeStatus,
            address: adressMaybe,
            city_id: cityIdMayBe
        }, {
            where: {
                id: self.bike.id
            },
            transaction: transaction
        });

        // Getting bike infos
        const updatedBike = await BikesModel.findByPk(self.bike.id, {transaction: transaction});
        let tracker: Trackers | null = null;
        let battery: Batteries | null = null;
        if (updatedBike) {
            tracker = await TrackersModel.findByPk(updatedBike.tracker_id, {transaction: transaction});
            battery = await BatteriesModel.findByPk(updatedBike.battery_id, {transaction: transaction});
        }

        // Processing stripe payment
        await self.setPaymentMethod();
        if(self.error) return self.error;

        if(updatedBike?.tags.includes("EXPERIMENTATION")) {
            if(duration > 60) {
                const paymentAmount = calculateExperimentalPrice(duration)
                await TripsModel.update({
                    status: TRIP_STATUS.EXPERIMENTATION,
                    price: paymentAmount,
                    duration: duration,
                    discounted_amount: 0,
                    discount_id: null,
                    user_subscription_id: null,
                    rental_id: null,
                    payment_method_id: self.paymentMethod?.id
                }, {
                    where: {
                        id: self.trip.id
                    },
                    transaction: transaction
                });
                updatedTrip = await TripsModel.findByPk(self.trip.id, {transaction: transaction});

                await mailEndTrip(self.user, updatedBike, tracker, battery, updatedTrip, city, JSON.stringify(paymentAmount), body.lock_status);
                return {
                    statusCode: 200,
                    result: {
                        status: "succeeded",
                        message: "EXPERIMENTATION",
                        returnUrl: null
                    }
                };
            } else if(duration <= 60 ) {
                await TripsModel.update({
                    status: TRIP_STATUS.EXPERIMENTATION,
                    price: 0,
                    duration: duration,
                    discounted_amount: 0,
                    discount_id: null,
                    user_subscription_id: null,
                    rental_id: null,
                    payment_method_id: self.paymentMethod?.id
                }, {
                    where: {
                        id: self.trip.id
                    },
                    transaction: transaction
                });
                updatedTrip = await TripsModel.findByPk(self.trip.id, {transaction: transaction});

                await transaction.commit();

                await mailEndTrip(self.user, updatedBike, tracker, battery, updatedTrip, city, JSON.stringify(0), body.lock_status);
                return {
                    statusCode: 200,
                    result: {
                        status: "succeeded",
                        message: "EXPERIMENTATION",
                        returnUrl: null
                    }
                };
            }
        }

        if (duration < 3) {
            // If price is under 50cent stripe will not accept the payment
            // Return user with success
            console.log(`Trip too short. Updating trip ${self.trip.id} status to FREE_TRIP.`);
            await TripsModel.update({
                status: TRIP_STATUS.FREE_TRIP,
                price: 0,
                duration: duration,
                discounted_amount: 0,
                discount_id: null,
                user_subscription_id: null,
                rental_id: null,
                payment_method_id: self.paymentMethod?.id
            }, {
                where: {
                    id: self.trip.id
                },
                transaction: transaction
            });
            await self.createTripStatus(TRIP_STATUS.FREE_TRIP);
            updatedTrip = await TripsModel.findByPk(self.trip.id, {transaction: transaction});

            const last10Trips = await TripsModel.findAll({
                where: {
                    user_id: self.user.id
                },
                order: [["id", "DESC"]],
                transaction: transaction,
                limit: 10
            });
            const count = last10Trips.filter(t => t.status === TRIP_STATUS.FREE_TRIP && (t.discounted_amount ?? 0) === 0).length;
            console.log(`User ${self.user.id} has ${count} FREE_TRIP in his last 10 trips`);
            if (count > 3) {
                if (MICROSERVICE_NOTIFICATION) {
                    await invokeAsync(MICROSERVICE_NOTIFICATION, {
                        message: `${self.user.firstname} ${self.user.lastname} (${self.user.id}) à ${count} FREE_TRIP dans ses 10 derniers trajets`,
                        type: "alert",
                        topic: SLACK_NOTIFICATION
                    });
                }
            }
            await transaction.commit();

            await mailEndTrip(self.user, updatedBike, tracker, battery, updatedTrip, city, finalPrice.code, body.lock_status);
            return {
                statusCode: 200,
                result: {
                    status: "succeeded",
                    message: "FREE_TRIP",
                    returnUrl: null
                }
            };
        }

        if (!self.paymentMethod) {
            console.log(`no payment method found for user ${self.user.id}`);
            await transaction.commit();
            return {
                statusCode: 404,
                result: "MISSING_PM"
            };
        }
        console.log("validation = ", validation);
        console.log("finalPrice.discounted_amount <= MIN_AMOUNT = ", finalPrice.discounted_amount <= MIN_AMOUNT);
        if (validation) {
            console.log(`Trip marked for validation. Pushing info to trip ${self.trip.id} without paying`);
            await TripsModel.update({
                status: TRIP_STATUS.WAIT_VALIDATION,
                payment_method_id: self.paymentMethod.id
            }, {
                where: {
                    id: self.trip.id
                },
                transaction: transaction
            });
            await self.createTripStatus(TRIP_STATUS.WAIT_VALIDATION);

            await transaction.commit();

            const tripForValidation = await TripsModel.findByPk(self.trip.id);

            await mailTripValidation(self.user, updatedBike, tracker, battery, tripForValidation, city, finalPrice.code, body.lock_status);
            return {
                statusCode: 200,
                result: {
                    status: "succeeded",
                    message: "FREE_TRIP",
                    returnUrl: null
                }
            };

        } else if (finalPrice.discounted_amount <= MIN_AMOUNT) {
            // If price is under 50cent stripe will not accept the payment
            // Return user with success
            console.log(`Trip under 50 cents. Updating trip ${self.trip.id} status to FREE_TRIP.`);
            await TripsModel.update({
                status: TRIP_STATUS.FREE_TRIP,
                payment_method_id: self.paymentMethod.id
            }, {
                where: {
                    id: self.trip.id
                },
                transaction: transaction
            });
            await self.createTripStatus(TRIP_STATUS.FREE_TRIP);
            
            await self.setTripById();

            await alertTripCounter(self.user, transaction);

            await transaction.commit();

            await mailEndTrip(self.user, updatedBike, tracker, battery, updatedTrip, city, finalPrice.code, body.lock_status);
            return {
                statusCode: 200,
                result: {
                    status: "succeeded",
                    message: "FREE_TRIP",
                    returnUrl: null
                }
            };
        } // End if free_trip

        if (self.trip.status !== TRIP_STATUS.WAIT_VALIDATION && self.trip.status !== TRIP_STATUS.OPEN && self.trip.status !== TRIP_STATUS.PAYMENT_HOLD_CONFIRM) {
            await transaction.commit();
            return {
                statusCode: 200,
                result: {
                    paymentIntent: self.trip.payment_intent,
                    uuid: self.trip.uuid
                }
            };
        }

        console.log(`Updating trip ${self.trip.id} status to PAYMENT_IN_PROGRESS.`);
        await TripsModel.update({
            status: TRIP_STATUS.PAYMENT_IN_PROGRESS
        }, {
            where: {
                id: self.trip.id
            },
            transaction: transaction
        });
        await self.createTripStatus(TRIP_STATUS.PAYMENT_IN_PROGRESS);

        // Create a stripe invoice
        console.log(`Creating stripe invoice for customer ${self.user.stripe_customer}...`);
        const invoice = await self.stripeApi.createInvoice(
            self.user.stripe_customer,
            finalPrice,
            PROVIDER_INVOICE_TYPE.TRIP_PAYMENT,
            self.trip.reference ?? "",
            "DESC_PAYMENT_TRIP"
        );

        const paymentIntentId = (typeof invoice.payment_intent === "string" ? invoice.payment_intent : invoice.payment_intent?.id) ?? null;

        console.log(invoice);
        console.log(`Updating trip ${self.trip.id} status to PAYMENT_INV_CREATED.`);
        await TripsModel.update({
            payment_intent: paymentIntentId,
            status: TRIP_STATUS.PAYMENT_INV_CREATED,
            invoice: invoice.hosted_invoice_url,
            payment_method_id: self.paymentMethod.id
        }, {
            where: {
                id: self.trip.id
            },
            transaction: transaction
        });
        const lastUpdatedTrip = await TripsModel.findByPk(self.trip.id, {transaction: transaction});
        await self.createTripStatus(TRIP_STATUS.PAYMENT_INV_CREATED);

        await transaction.commit();
        // Email trip info to admin
        await mailEndTrip(self.user, updatedBike, tracker, battery, lastUpdatedTrip, city, finalPrice.code, body.lock_status);

        console.log(`Confirming payment intent : ${invoice.payment_intent}`);
        // Ensure you confirm the payment after creating the invoice
        let paymentIntent;
        try {
            paymentIntent = await self.stripeApi.confirmPayment(paymentIntentId ?? "", self.paymentMethod.card_token, RETURN_URL_PAYMENT, (self.user.email ?? "").trim());
        } catch (error) {
            await TripsModel.update({
                payment_intent: paymentIntentId,
                status: TRIP_STATUS.PAYMENT_FAILED
            }, {
                where: {
                    id: self.trip.id
                }
            });
            await self.createTripStatus(TRIP_STATUS.PAYMENT_FAILED);

            return {
                statusCode: 402,
                result: "stripe-error"
            };
        }
        console.log(`Payment intent status : ${paymentIntent.status}`);
        console.log("[paymentIntent]", paymentIntent);

        // Check each stripe status
        const pStatus = paymentIntent.status ? paymentIntent.status.toLowerCase() : "other";
        let tripStatus: string | null = null;
        let redirectUrl: string | null = null;
        switch (pStatus) {
            case "requires_action":
                redirectUrl = paymentIntent.next_action?.redirect_to_url?.url ?? null;
                tripStatus = TRIP_STATUS.PAYMENT_HOLD_CONFIRM;
                break;
            default:
                break;
        }
        if (tripStatus) {
            // Updating trip status
            console.log(`Updating trip ${self.trip.id} status to ${tripStatus}.`);
            await TripsModel.update({
                status: tripStatus
            }, {
                where: {
                    id: self.trip.id
                }
            });
            await self.createTripStatus(tripStatus);
        }

        try {
            if (functionalitiesName.includes("END_TRIP_GAME")) {
                console.log("Checking if user is playing a game...");
                await checkGamePlayed(userId, deviceToken, locale);
            } else {
                console.log("Checking if user is playing a game is not active...");
            }
            const spot = await findNearestSpot(self.lat, self.lng);
            console.log("Spot: ", spot);
            // 3. Set spots id to bikes
            await BikesModel.update(
                {
                    spot_id: spot?.id ?? null
                },
                {
                    where: {
                        id: self.bike.id
                    }
                }
            );
            if (functionalitiesName.includes("SPOT_PARKING_PROMO")) {
                console.log("Checking if user parked on spot...");
                await checkSpotArea(userId, deviceToken, spot, locale);
            } else {
                console.log("Checking if user parked on spot is not active");
            }
        } catch (err) {
            console.log("[ERROR] - while playing user game...", err);
        }

        return {
            statusCode: 200,
            result: {
                client_secret: paymentIntent?.client_secret,
                paymentIntent: paymentIntent?.id,
                status: paymentIntent?.status,
                uuid: self.trip?.uuid,
                redirectUrl: redirectUrl
            }
        };
    } catch (error) {
        console.log(error);
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        try {
            await transaction.rollback();
        } catch (e) {
            console.log("Transaction rollback errored");
            console.log(e);
        }
        try {
            const user = await UsersModel.findByPk(userId);
            await mailAlertTrip(user, {
                message: error?.message ?? "--Unknown--",
                bike_id: self.bike.id,
                trip_id: self.trip.id,
                bike_name: self.bike.name || "",
                lat: body.lat,
                lng: body.lng,
                address: self.address,
                status: TRIP_STATUS.FAILED_AT_END
            });
        } catch (e) {
            console.log("Alert mail errored");
            console.log(e);
        }

        error.message = "TRIP_ERROR_END";
        throw error;
    }
};
