import { BOOKING_DURATION_MS } from "../config/config";
import {
    BatteriesModel,
    BIKE_STATUS,     BikesModel,
    BOOKING_STATUS,     BookingsModel,
    getSequelize,
    PostCreateBookingInput,
    TrackersModel,
    updateBikeStatus} from "@bikairproject/lib-manager";

export const create = async (body: PostCreateBookingInput, locale: string, userId: number, origin: string) => {
    const transaction = await getSequelize().transaction();

    try {

        if (!body.bike_name) {
            console.warn("Missing bike name param");
            return {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }

        // Ensure bike is available
        const bikeName = body.bike_name.trim().toUpperCase();
        const bike = await BikesModel.findOne({
            where: {
                name: bikeName
            },
            transaction: transaction
        });
        if (!bike) {
            console.warn(`Bike ${bikeName} not found.`);
            return {
                statusCode: 400,
                result: "BIKE_NOT_FOUND"
            };
        }
        if (bike.status !== "AVAILABLE") {
            console.warn(`Bike ${bikeName} not AVAILABLE`);
            return {
                statusCode: 400,
                result: "BIKE_NOT_AVAILABLE"
            };
        }

        // Create a new booking
        const now = new Date().getTime();
        const expiredAt = new Date(now + BOOKING_DURATION_MS).getTime();
        // const expiredAt = `${exp.getFullYear()}-${exp.getMonth()+1}-${exp.getDate()} ${exp.getHours()}:${exp.getMinutes()}:${exp.getSeconds()}`

        const booking = await BookingsModel.create({
            bike_id: bike.id,
            user_id: userId,
            expired_at: String(expiredAt),
            status: BOOKING_STATUS.OPEN
        }, {
            transaction: transaction
        });

        // Assign a bike
        await updateBikeStatus(booking.bike_id, BIKE_STATUS.BOOKED,  origin, userId, null, transaction);

        const tracker = await TrackersModel.findByPk(bike.tracker_id, { transaction: transaction });
        const battery = await BatteriesModel.findByPk(bike.battery_id, { transaction: transaction });

        await transaction.commit();
        return {
            statusCode: 200,
            result: {
                uuid: booking.uuid,
                expired_at: booking.expired_at,
                name: bike.name,
                address: bike.address,
                coordinates: tracker?.coordinates?.coordinates as [number, number] | undefined,
                status: "BOOKED",
                capacity: battery?.capacity
            }
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        console.log("[ERROR] userId : ", userId);
        await transaction.rollback();

        if (error.name === "SequelizeUniqueConstraintError") {
            error.message = "BOOKING_ALREADY_CREATED";
        }

        throw error;
    }
};
