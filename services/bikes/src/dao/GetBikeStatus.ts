import {
    BIKE_STATUS,
    BIKE_TAGS,
    BikesModel,
    BOOKING_STATUS,
    BookingsModel,
    getRentalEnd,
    TRIP_STATUS,
    TripsModel
} from "@bikairproject/lib-manager";


export const GetBikeStatus = async (userId: number, bikeName: string) => {
    const bike = await BikesModel.findOne({
        where: {
            name: bikeName
        }
    });

    if (!bike) {
        return null;
    }

    const booking = await BookingsModel.findOne({where: {
        status: BOOKING_STATUS.OPEN,
        bike_id: bike.id
    }});
    const trip = await TripsModel.findOne({where: {
        status: TRIP_STATUS.OPEN,
        bike_id: bike.id,
        user_id: userId
    }});
    const isBookingBelongToCurrentUser = booking?.user_id === userId;
    const hasRental = await getRentalEnd(userId);

    let result: any;
    let experimentationTag: string | undefined;
    switch (bike?.status) {
        case BIKE_STATUS.AVAILABLE:
            result = BIKE_STATUS.AVAILABLE;
            break;
        case BIKE_STATUS.RENTAL:
            result = hasRental ? BIKE_STATUS.AVAILABLE : BIKE_STATUS.RENTAL;
            break;
        case BIKE_STATUS.BOOKED:
            result = isBookingBelongToCurrentUser ? BIKE_STATUS.AVAILABLE : BIKE_STATUS.BOOKED;
            break;
        case BIKE_STATUS.USED:
            result = trip ? BIKE_STATUS.AVAILABLE : BIKE_STATUS.USED;
            break;
        case BIKE_STATUS.PAUSED:
            result = trip ? BIKE_STATUS.AVAILABLE : BIKE_STATUS.PAUSED;
            break;
        default:
            result = BIKE_STATUS.MAINTENANCE;
            break;
    }

    if (bike?.tags && Array.isArray(bike.tags)) {
        experimentationTag = bike.tags.find(tag => tag.includes(BIKE_TAGS.EXPERIMENTATION));
    }

    return {status: result, tags: experimentationTag};
};
