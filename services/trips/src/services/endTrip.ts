import {
    GOOGLE_GEOCODING_API_KEY,
    MICROSERVICE_NOTIFICATION,
    MIN_AMOUNT,
    RETURN_URL_PAYMENT,
    SLACK_NOTIFICATION,
    STRIPE_SECRET_KEY,
    STRIPE_TAX_RATES
} from "../config/config";
import {checkGamePlayed} from "./checkGamePlay";
import {checkSpotArea} from "./checkSpotArea";
import {computeFinalPrice, resolveReductionUsage} from "./computePrice";
import {GoogleMaps} from "@bikairproject/google-api";
import {invokeAsync} from "@bikairproject/lambda-utils";
import {
    BatteriesModel,
    BikesModel,
    checkArea,
    checkRedZoneArea, CitiesModel,
    createBikePosition,
    findFunctionalitiesForCity,
    findNearestSpot,
    getSequelize,
    PaymentMethodsModel,
    TrackersModel,
    TripsModel,
    TripStatusModel,
    updateCoordinates,
    UserSettingsModel,
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
    STATUS,
    Trackers,
    TRIP_REDUCTIONS,
    TRIP_STATUS,
    TripsUpdate
} from "@bikairproject/lib-manager";
import {GeoUtils} from "@bikairproject/lib-manager";
import {mailTripValidation} from "@bikairproject/mailing/dist/functions/TripValidation";
import {StripeApi} from "@bikairproject/stripe-api";

const ORIGIN = "MOBILE_APP";

/**
 *
 * @param userId
 * @param body
 * @param locale
 * @param origin
 * @returns
 */
export const endTrip = async (userId: number, body: PutEndTripInput, locale: string, origin: string) => {
    const transaction = await getSequelize().transaction();
    let bikeId, tripId, address, bikeName;

    try {
        if (typeof STRIPE_SECRET_KEY === "undefined" ||
            typeof STRIPE_TAX_RATES === "undefined") {
            return {
                statusCode: 500,
                result: "Missing env var value"
            };
        }
        const stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);

        const currentUser = await UsersModel.findByPk(userId, {
            transaction: transaction
        });
        const userSettings = await UserSettingsModel.findOne({
            where: {
                user_id: userId
            },
            transaction: transaction
        });

        if (!currentUser || !currentUser.stripe_customer) {
            console.log(`User ${userId} not found`);
            return {
                statusCode: 400,
                result: "Malformed request"
            };
        }
        console.log(`Ending trip for user ${currentUser.id}`);

        console.log(`body.offline = ${body.offline}`);
        const offline = body.offline ?? false;
        console.log(`offline = ${offline}`);
        console.log(`body.validation = ${body.validation}`);
        const validation = body.validation ?? false;
        console.log(`validation = ${validation}`);
        // We declare variable before try/catch, so we can use it to reset if necessary
        let trueLatLng = true;

        const trip = await TripsModel.findOne({
            where: {
                user_id: currentUser.id,
                status: ["OPEN", "WAIT_VALIDATION"]
            },
            transaction: transaction
        });
        if (!trip) {
            console.log(`Trip not found for user ${currentUser.id}`);
            await transaction.commit();
            return {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
        }
        const bike = await BikesModel.findByPk(trip?.bike_id);
        if (!bike) {
            console.log(`Bike ${trip?.bike_id} not found for trip ${trip?.id}`);
            await transaction.commit();
            return {
                statusCode: 404,
                result: "BIKE_NOT_FOUND"
            };
        }
        console.log("[TRIPS]", trip);
        console.log(`Trip id: ${trip.id}`);

        // Set variable
        bikeId = trip.bike_id;
        tripId = trip.id;

        if (!body.lat || !body.lng) {
            console.log("Missing lat and lng parameters.");
            const tracker = await TrackersModel.findOne({where: {bike_id: bikeId}});
            body.lat = tracker?.coordinates?.coordinates[1] ?? trip.start_coords?.coordinates[1];
            body.lng = tracker?.coordinates?.coordinates[0] ?? trip.start_coords?.coordinates[0];
            trueLatLng = false;
        }

        if (!body.lat || !body.lng) {
            await transaction.commit();
            return {
                statusCode: 400,
                result: "Malformed request"
            };
        }

        try {
            console.log("[BODY] - latitude -> ", body.lat);
            console.log("[BODY] - longitude -> ", body.lng);
            if (body.lat && body.lng) {
                address = await GeoUtils.reverseGeo(body.lat, body.lng);
                console.log("Reverse Geolocation -> ", address);
                if (address === "NONE" && GOOGLE_GEOCODING_API_KEY) {
                    try {
                        const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                        address = await googleGeoCode.getAddress(body.lat, body.lng);
                        console.log("Get Address -> ", address);
                    } catch (error: any) {
                        console.log("Error while getting the address from coordinates -> ", error.message);
                    }
                }
            } else {
                console.error("Invalid latitude or longitude values");
            }

        } catch (error) {
            console.log("Error while reverse geocoding");
            address = "NONE";
        }

        // Ensure the bike is not inside the red zone
        const isInCityRedZone = await checkRedZoneArea(body.lat, body.lng);
        console.log("isInCityRedZone ? ", !!isInCityRedZone);

        let city: CityArea | null = await checkArea(body.lat, body.lng);
        console.log("City ? ", !!city);

        const spot = await findNearestSpot(body.lat, body.lng, true, null);
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
        const deviceToken = userSettings?.device_token ?? "";

        if(!city && currentUser.city_id) {
            city = await CitiesModel.findByPk(currentUser.city_id);
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
            console.log(`Updating bike ${bikeId} tracker with user last position [${body.lat},${body.lng}]`);
            // Update tracker with user GPS coords
            await updateCoordinates(bike.tracker_id, body.lat, body.lng, ORIGIN, transaction);
            const distFromLastPosition = GeoUtils.getDistanceFromLatLonInKm(body.lat, body.lng, body.lat, body.lng);
            await createBikePosition(bikeId, ORIGIN, body.lat, body.lng, distFromLastPosition, transaction);

            console.log(`Updating trip ${tripId} coordinates and address [${address}]...`);
            const endCoord: Point = {
                type: "Point",
                coordinates: [body.lng, body.lat]
            };
            await TripsModel.update({
                end_address: address,
                city_id: city.id,
                end_coords: endCoord
            }, {
                where: {
                    id: tripId
                },
                transaction: transaction
            });
        }

        const timeEnd = body.time_end ?? new Date().getTime();

        console.log(`Updating trip ${tripId} with status CLOSED...`);
        await TripsModel.update({
            status: TRIP_STATUS.CLOSED,
            time_end: String(timeEnd)
        }, {
            where: {
                id: tripId
            },
            transaction: transaction
        });
        let updatedTrip: any = await TripsModel.findByPk(tripId, {transaction: transaction});
        if (!updatedTrip) {
            console.log("Can not find updated trip !");
            return {
                statusCode: 500,
                result: "Server Error"
            };
        }
        await TripStatusModel.create({
            status: TRIP_STATUS.CLOSED,
            trip_id: trip.id
        }, {
            transaction: transaction
        });

        console.log("Calculate price based on subscription - pass - discount...");
        updatedTrip.bike_tags = bike?.tags;
        const finalPrice = await computeFinalPrice(updatedTrip, transaction);
        console.log("finalPrice : ", finalPrice);
        const tripUpdatePrice: TripsUpdate = {
            id: tripId,
            duration: finalPrice.minutes,
            price: finalPrice.price,
            discounted_amount: finalPrice.reduction
        };
        if (finalPrice.type === TRIP_REDUCTIONS.NONE) {
            tripUpdatePrice.discount_id = null;
            tripUpdatePrice.user_subscription_id = null;
            tripUpdatePrice.rental_id = null;
        }

        console.log("finalPrice", finalPrice);

        if (finalPrice.type !== TRIP_REDUCTIONS.NONE) {
            await TripStatusModel.create({
                status: finalPrice.type,
                trip_id: tripId
            }, {
                transaction: transaction
            });
        }

        if(finalPrice.minutes > 2) {
            console.log(`Updating trip ${tripId} with duration ${finalPrice.minutes}, price ${finalPrice.price} and discounted_amount ${finalPrice.price - finalPrice.discounted_amount}`);
            // Update trip price
            await TripsModel.update(tripUpdatePrice, {
                where: {
                    id: tripId
                },
                transaction: transaction
            });
        }
        const tripWithPrice = await TripsModel.findByPk(tripId, {transaction: transaction});
        if (tripWithPrice && !validation && finalPrice.minutes > 2) {
            console.log("Resolving reduction usage");
            await resolveReductionUsage(finalPrice, tripWithPrice, transaction);
        }

        console.log(`Update bike ${bikeId} status to AVAILABLE...`);
        // Ensure you update bike status
        const cityIdMayBe = city?.id ?? undefined;
        const adressMaybe = address === "NONE" ? undefined : address;
        const bikeStatus = finalPrice.type === TRIP_REDUCTIONS.RENTAL ? BIKE_STATUS.RENTAL : validation ? BIKE_STATUS.USED : BIKE_STATUS.AVAILABLE;


        await BikesModel.update({
            status: bikeStatus,
            address: adressMaybe,
            city_id: cityIdMayBe
        }, {
            where: {
                id: bikeId
            },
            transaction: transaction
        });

        // Getting bike infos
        const updatedBike = await BikesModel.findByPk(bikeId, {transaction: transaction});
        let tracker: Trackers | null = null;
        let battery: Batteries | null = null;
        if (updatedBike) {
            tracker = await TrackersModel.findByPk(updatedBike.tracker_id, {transaction: transaction});
            battery = await BatteriesModel.findByPk(updatedBike.battery_id, {transaction: transaction});
        }

        // Processing stripe payment
        const paymentMethod = await PaymentMethodsModel.findOne({
            where: {
                user_id: currentUser.id,
                status: STATUS.ACTIVE
            },
            transaction: transaction
        });

        if (finalPrice.minutes < 3) {
            // If price is under 50cent stripe will not accept the payment
            // Return user with success
            console.log(`Trip too short. Updating trip ${tripId} status to FREE_TRIP.`);
            await TripsModel.update({
                status: TRIP_STATUS.FREE_TRIP,
                price: 0,
                duration: finalPrice.minutes,
                discounted_amount: 0,
                discount_id: null,
                user_subscription_id: null,
                rental_id: null,
                payment_method_id: paymentMethod?.id
            }, {
                where: {
                    id: tripId
                },
                transaction: transaction
            });
            await TripStatusModel.create({
                status: TRIP_STATUS.FREE_TRIP,
                trip_id: tripId
            }, {
                transaction: transaction
            });
            updatedTrip = await TripsModel.findByPk(tripId, {transaction: transaction});

            const last10Trips = await TripsModel.findAll({
                where: {
                    user_id: currentUser.id
                },
                order: [["id", "DESC"]],
                transaction: transaction,
                limit: 10
            });
            const count = last10Trips.filter(t => t.status === TRIP_STATUS.FREE_TRIP && (t.discounted_amount ?? 0) === 0).length;
            console.log(`User ${currentUser.id} has ${count} FREE_TRIP in his last 10 trips`);
            if (count > 3) {
                if (MICROSERVICE_NOTIFICATION) {
                    await invokeAsync(MICROSERVICE_NOTIFICATION, {
                        message: `${currentUser.firstname} ${currentUser.lastname} (${currentUser.id}) à ${count} FREE_TRIP dans ses 10 derniers trajets`,
                        type: "alert",
                        topic: SLACK_NOTIFICATION
                    });
                }
            }
            await transaction.commit();

            await mailEndTrip(currentUser, updatedBike, tracker, battery, updatedTrip, city, finalPrice.code, body.lock_status);
            return {
                statusCode: 200,
                result: {
                    status: "succeeded",
                    message: "FREE_TRIP",
                    returnUrl: null
                }
            };
        }

        if (!paymentMethod) {
            console.log(`no payment method found for user ${currentUser.id}`);
            await transaction.commit();
            return {
                statusCode: 404,
                result: "MISSING_PM"
            };
        }
        console.log("validation = ", validation);
        console.log("finalPrice.discounted_amount <= MIN_AMOUNT = ", finalPrice.discounted_amount <= MIN_AMOUNT);
        if (validation) {
            console.log(`Trip marked for validation. Pushing info to trip ${tripId} without paying`);
            await TripsModel.update({
                status: TRIP_STATUS.WAIT_VALIDATION,
                payment_method_id: paymentMethod.id
            }, {
                where: {
                    id: tripId
                },
                transaction: transaction
            });
            await TripStatusModel.create({
                status: TRIP_STATUS.WAIT_VALIDATION,
                trip_id: tripId
            }, {
                transaction: transaction
            });

            await transaction.commit();

            const tripForValidation = await TripsModel.findByPk(tripId);

            await mailTripValidation(currentUser, updatedBike, tracker, battery, tripForValidation, city, finalPrice.code, body.lock_status);
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
            console.log(`Trip under 50 cents. Updating trip ${tripId} status to FREE_TRIP.`);
            await TripsModel.update({
                status: finalPrice.status,
                payment_method_id: paymentMethod.id
            }, {
                where: {
                    id: tripId
                },
                transaction: transaction
            });
            await TripStatusModel.create({
                status: finalPrice.status,
                trip_id: tripId
            }, {
                transaction: transaction
            });
            updatedTrip = await TripsModel.findByPk(tripId, {transaction: transaction});

            const last10Trips = await TripsModel.findAll({
                where: {
                    user_id: currentUser.id
                },
                order: [["id", "DESC"]],
                transaction: transaction,
                limit: 10
            });
            const count = last10Trips.filter(t => t.status === TRIP_STATUS.FREE_TRIP && (t.discounted_amount ?? 0) > 0).length;
            console.log(`User ${currentUser.id} has ${count} FREE_TRIP in his last 10 trips`);
            if (count > 3) {
                if (MICROSERVICE_NOTIFICATION) {
                    await invokeAsync(MICROSERVICE_NOTIFICATION, {
                        message: `${currentUser.firstname} ${currentUser.lastname} (${currentUser.id}) à ${count} FREE_TRIP dans ses 10 derniers trajets`,
                        type: "alert",
                        topic: SLACK_NOTIFICATION
                    });
                }
            }
            await transaction.commit();

            await mailEndTrip(currentUser, updatedBike, tracker, battery, updatedTrip, city, finalPrice.code, body.lock_status);
            return {
                statusCode: 200,
                result: {
                    status: "succeeded",
                    message: "FREE_TRIP",
                    returnUrl: null
                }
            };
        } // End if free_trip

        if (trip.status !== TRIP_STATUS.WAIT_VALIDATION && trip.status !== TRIP_STATUS.OPEN && trip.status !== TRIP_STATUS.PAYMENT_HOLD_CONFIRM) {
            await transaction.commit();
            return {
                statusCode: 200,
                result: {
                    paymentIntent: trip.payment_intent,
                    uuid: trip.uuid
                }
            };
        }

        console.log(`Updating trip ${tripId} status to PAYMENT_IN_PROGRESS.`);
        await TripsModel.update({
            status: TRIP_STATUS.PAYMENT_IN_PROGRESS
        }, {
            where: {
                id: tripId
            },
            transaction: transaction
        });
        await TripStatusModel.create({
            status: TRIP_STATUS.PAYMENT_IN_PROGRESS,
            trip_id: tripId
        }, {
            transaction: transaction
        });

        // Create a stripe invoice
        console.log(`Creating stripe invoice for customer ${currentUser.stripe_customer}...`);
        const invoice = await stripeApi.createInvoice(
            currentUser.stripe_customer,
            finalPrice,
            PROVIDER_INVOICE_TYPE.TRIP_PAYMENT,
            trip.reference ?? "",
            "DESC_PAYMENT_TRIP"
        );

        const paymentIntentId = (typeof invoice.payment_intent === "string" ? invoice.payment_intent : invoice.payment_intent?.id) ?? null;

        console.log(invoice);
        console.log(`Updating trip ${tripId} status to PAYMENT_INV_CREATED.`);
        await TripsModel.update({
            payment_intent: paymentIntentId,
            status: TRIP_STATUS.PAYMENT_INV_CREATED,
            invoice: invoice.hosted_invoice_url,
            payment_method_id: paymentMethod.id
        }, {
            where: {
                id: tripId
            },
            transaction: transaction
        });
        const lastUpdatedTrip = await TripsModel.findByPk(tripId, {transaction: transaction});
        await TripStatusModel.create({
            status: TRIP_STATUS.PAYMENT_INV_CREATED,
            trip_id: tripId
        }, {
            transaction: transaction
        });

        await transaction.commit();
        // Email trip info to admin
        await mailEndTrip(currentUser, updatedBike, tracker, battery, lastUpdatedTrip, city, finalPrice.code, body.lock_status);

        console.log(`Confirming payment intent : ${invoice.payment_intent}`);
        // Ensure you confirm the payment after creating the invoice
        let paymentIntent;
        try {
            paymentIntent = await stripeApi.confirmPayment(paymentIntentId ?? "", paymentMethod.card_token, RETURN_URL_PAYMENT, (currentUser.email ?? "").trim());
        } catch (error) {
            await TripsModel.update({
                payment_intent: paymentIntentId,
                status: TRIP_STATUS.PAYMENT_FAILED
            }, {
                where: {
                    id: tripId
                }
            });
            await TripStatusModel.create({
                status: TRIP_STATUS.PAYMENT_FAILED,
                trip_id: tripId
            });

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
            console.log(`Updating trip ${tripId} status to ${tripStatus}.`);
            await TripsModel.update({
                status: tripStatus
            }, {
                where: {
                    id: tripId
                }
            });
            await TripStatusModel.create({
                status: tripStatus,
                trip_id: tripId
            });
        }

        try {
            if (functionalitiesName.includes("END_TRIP_GAME")) {
                console.log("Checking if user is playing a game...");
                await checkGamePlayed(userId, deviceToken, locale);
            } else {
                console.log("Checking if user is playing a game is not active...");
            }
            const spot = await findNearestSpot(body.lat, body.lng);
            console.log("Spot: ", spot);
            // 3. Set spots id to bikes
            await BikesModel.update(
                {
                    spot_id: spot?.id ?? null
                },
                {
                    where: {
                        id: bikeId
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
                uuid: trip?.uuid,
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
                bike_id: bikeId,
                trip_id: tripId,
                bike_name: bikeName || "",
                lat: body.lat,
                lng: body.lng,
                address: address,
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

