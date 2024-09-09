import {Transaction} from "sequelize";

import { INIT_PRICE_TRIP, MINUTES_EXPERIMENTATION } from "../config/config";
import { ComputedPriceOutput } from "../lib/ComputedPriceOutput";
import {calculTripDuration, computePrice,TRIP_STATUS} from "@bikairproject/lib-manager";
import {
    BIKE_TAGS,
    ComputedPrice,
    DISCOUNT_CODE,
    DiscountsModel,
    findUserSubscription,
    getTripReductionDiscountById,
    getTripReductionProductById,
    getTripReductionRentalById,
    mailTripRental,
    RENTAL_STATUS,
    RentalsModel,
    STATUS,
    SUBSCRIPTION_STATUS,
    TRIP_REDUCTIONS,
    TripReduction,
    Trips,
    UserDiscountsModel,
    UserDiscountsUpdate,
    UsersModel,
    UserSubscriptionDetail,
    UserSubscriptionsModel
} from "@bikairproject/lib-manager";

interface TripInput extends Trips {
    bike_tags: string[]
}


export const getTripReductionFromTrip = async (trip: TripInput, transaction?: Transaction): Promise<TripReduction | null> => {
    let tripReduction: TripReduction | null = null;
    console.log("Trip --> ", trip);
    if (trip.rental_id) {
        tripReduction = await getTripReductionRentalById(trip.rental_id, transaction);
        console.log("Rental Trip reduction --> ", tripReduction);
    } else if (trip.user_subscription_id) {
        tripReduction = await getTripReductionProductById(trip.user_subscription_id, transaction);
        console.log("Subscription Trip reduction --> ", tripReduction);
    } else if (trip.discount_id) {
        tripReduction = await getTripReductionDiscountById(trip.discount_id, trip.user_id, transaction);
        console.log("Discount Trip reduction --> ", tripReduction);
        console.log("Discount Trip reduction type --> ", tripReduction?.discount_type);
        console.log("Discount Trip reduction code --> ", tripReduction?.code);
    }
    console.log("Reduction --> ", tripReduction);
    return tripReduction;
};

export const calculateExperimentalPrice = (duration: number) => {
    return (duration - 60) * 0.15;
};

export const resolveReductionUsage = async (computedPrice: ComputedPrice, trip: Trips, transaction?: Transaction) => {
    if (computedPrice.type === TRIP_REDUCTIONS.PRODUCT && trip.user_subscription_id) {
        console.log("Resolve product");
        await resolveProductUsage(trip, transaction);
    } else if (computedPrice.type === TRIP_REDUCTIONS.DISCOUNT && trip.discount_id) {
        console.log("Resolve discount");
        await resolveDiscountUsage(computedPrice, trip, transaction);
    } else if (computedPrice.type === TRIP_REDUCTIONS.RENTAL && trip.rental_id) {
        console.log("Resolve rental");
        await resolveRentalUsage(trip, transaction);
    }
};

const resolveDiscountUsage = async (computedPrice: ComputedPrice, trip: Trips, transaction?: Transaction) => {
    console.log("resolve Discount Usage for discount ", trip.discount_id);
    if (trip.discount_id) {
        const userDiscount = await UserDiscountsModel.findOne({
            where: {
                user_id: trip.user_id,
                status: STATUS.ACTIVE,
                discount_id: trip.discount_id
            },
            transaction: transaction
        });
        if (userDiscount) {
            const discount = await DiscountsModel.findByPk(userDiscount.discount_id, {transaction: transaction});
            if (discount) {
                const updateData: UserDiscountsUpdate = {id: userDiscount.id};
                console.log("discount.type = ", discount.type);
                switch (discount.type) {
                    case DISCOUNT_CODE.PACK:
                        console.log("Applying PACK case");
                        updateData.remaining = (userDiscount.remaining ?? 0) - Math.min(computedPrice.minutes, userDiscount.remaining ?? 0);
                        console.log("Remaining : ", userDiscount.remaining);
                        if (updateData.remaining <= 0) {
                            console.log("closing because no more time left");
                            updateData.status = STATUS.CLOSED;
                            updateData.used = true;
                        }
                        break;
                    case DISCOUNT_CODE.SPONSOR:
                        console.log("Applying SPONSOR case");
                        await giveSponsorBack(userDiscount, transaction);
                        updateData.status = STATUS.CLOSED;
                        updateData.used = true;
                        break;
                    default:
                        console.log("Applying DEFAULT case");
                        if (!discount.reusable) {
                            updateData.status = STATUS.CLOSED;
                            updateData.used = true;
                        }
                        break;
                }

                try {
                    await UserDiscountsModel.update(updateData, {
                        where: {
                            id: userDiscount.id
                        },
                        transaction: transaction
                    });
                } catch (error) {
                    console.log("Error while applying user discount update : ", error);
                }
            } else {
                console.log("Discount not found");
            }
        } else {
            console.log("User Discount not found");
        }
    } else {
        console.log("Missing discount id or user discount id");
    }
};

const giveSponsorBack = async (userDiscount: UserDiscountsModel, transaction?: Transaction) => {
    const user = await UsersModel.findOne({
        where: {
            code: userDiscount.code_ref
        },
        transaction: transaction
    });
    const sponsorBack = await DiscountsModel.findOne({
        where: {
            code: "SPONSOR_BACK"
        },
        transaction: transaction
    });

    if (user && sponsorBack) {
        await UserDiscountsModel.create({
            user_id: user.id,
            discount_id: sponsorBack.id,
            remaining: sponsorBack.value,
            used: false,
            status: STATUS.ACTIVE,
            code_ref: sponsorBack.code
        }, {
            transaction: transaction
        });
    }
};

const resolveProductUsage = async (trip: Trips, transaction?: Transaction) => {
    console.log("resolve Product Usage for subscription ", trip.user_subscription_id);
    const userSubscription = await findUserSubscription(trip.user_subscription_id ?? -1, transaction);

    if (userSubscription) {
        if (userSubscription.recurring) {
            console.log("Resolve recuring");
            await resolveRecurringProductUsage(userSubscription, transaction);
        } else {
            console.log("Resolve recuring");
            await resolveNotRecurringProductUsage(trip, userSubscription, transaction);
        }
    }
};

const resolveRecurringProductUsage = async (userSubscriptionDetail: UserSubscriptionDetail, transaction?: Transaction) => {
    await UserSubscriptionsModel.update({
        total_usage: userSubscriptionDetail.total_usage + 1
    }, {
        where: {
            id: userSubscriptionDetail.id
        },
        transaction: transaction
    });
};
const resolveNotRecurringProductUsage = async (trip: Trips, userSubscriptionDetail: UserSubscriptionDetail, transaction?: Transaction) => {
    let updateData: Partial<UserSubscriptionsModel> = {};
    switch (userSubscriptionDetail.discount_type) {
        case DISCOUNT_CODE.ONE_SHOT:
        case DISCOUNT_CODE.PERCENT:
            console.log("Resolve per trip");
            updateData = resolveNotRecurringTripProductUsage(userSubscriptionDetail);
            break;
        case DISCOUNT_CODE.PACK:
            console.log("Resolve per minute");
            updateData = resolveNotRecurringMinuteProductUsage(trip, userSubscriptionDetail);
            break;
    }

    console.log("updateData = ", updateData);
    await UserSubscriptionsModel.update(updateData, {
        where: {
            id: userSubscriptionDetail.id
        },
        transaction: transaction
    });
};

const resolveNotRecurringTripProductUsage = (userSubscriptionDetail: UserSubscriptionDetail) => {
    const updateData: Partial<UserSubscriptionsModel> = {};
    updateData.total_usage = userSubscriptionDetail.total_usage + 1;

    console.log("updateData.total_usage = ", updateData.total_usage);
    console.log("userSubscriptionDetail.max_usage = ", userSubscriptionDetail.max_usage);
    if (updateData.total_usage >= userSubscriptionDetail.max_usage) {
        console.log("All trip consumed. Expiring pack");
        updateData.status = SUBSCRIPTION_STATUS.EXPIRED;
    }
    return updateData;
};

const resolveNotRecurringMinuteProductUsage = (trip: Trips, userSubscriptionDetail: UserSubscriptionDetail) => {
    const updateData: Partial<UserSubscriptionsModel> = {};
    console.log("trip.duration = ", trip.duration);
    updateData.total_usage = userSubscriptionDetail.total_usage + (trip.duration ?? 0);

    console.log("updateData.total_usage = ", updateData.total_usage);
    console.log("userSubscriptionDetail.discount_value = ", userSubscriptionDetail.discount_value);
    if (updateData.total_usage >= userSubscriptionDetail.discount_value) {
        console.log("All minute consumed. Expiring pack");
        updateData.total_usage = userSubscriptionDetail.discount_value;
        updateData.status = SUBSCRIPTION_STATUS.EXPIRED;
    }
    return updateData;
};

const resolveRentalUsage = async (trip: Trips, transaction?: Transaction) => {
    if (trip.rental_id) {
        await RentalsModel.update({status: RENTAL_STATUS.EXPIRED}, {
            where: {
                id: trip.rental_id
            },
            transaction: transaction
        });
        const user = await UsersModel.findByPk(trip.user_id, {transaction: transaction});
        await mailTripRental(user);
    }
};

export const computeFinalPrice = async (trip: TripInput, transaction?: Transaction) => {
    const duration = calculTripDuration(Number(trip.time_start), Number(trip.time_end ?? "0"));
    const basePrice = duration * INIT_PRICE_TRIP;
    let finalPrice : ComputedPriceOutput = {
        price: basePrice,
        discounted_amount: basePrice,
        reduction: 0,
        minutes: duration,
        code: null,
        type: TRIP_REDUCTIONS.NONE,
        status: TRIP_STATUS.FREE_TRIP
    };
    if(trip.bike_tags.includes(BIKE_TAGS.EXPERIMENTATION)) {
        const newDuration = duration >= MINUTES_EXPERIMENTATION ? duration - MINUTES_EXPERIMENTATION : duration;
        const reduction =  duration >= MINUTES_EXPERIMENTATION ? Math.min(duration, MINUTES_EXPERIMENTATION) * INIT_PRICE_TRIP : basePrice;
        finalPrice = {
            price: duration * INIT_PRICE_TRIP,
            discounted_amount: basePrice - reduction,
            reduction: reduction,
            minutes: newDuration,
            code: null,
            type: TRIP_REDUCTIONS.NONE,
            is_discounted: true,
            status: BIKE_TAGS.EXPERIMENTATION
        };
        console.log("finalPrice : ", finalPrice);
        return finalPrice;
    }
    console.log("duration : ", duration);
    const tripReduction = await getTripReductionFromTrip(trip, transaction);
    console.log("Trip reduction : ", tripReduction);
    finalPrice = computePrice(tripReduction, Number(trip.time_start), duration, true);
    if(tripReduction){
        finalPrice.is_discounted = true;
    }else{
        finalPrice.is_discounted = false;
    }
    console.log("finalPrice : ", finalPrice);

    return finalPrice;
};
