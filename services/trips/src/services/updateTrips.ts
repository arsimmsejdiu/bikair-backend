import { TripsModel } from "@bikairproject/lib-manager";
import { PutTripsInput } from "@bikairproject/lib-manager";

export const updateTrips = async (body: PutTripsInput, locale: string) => {
    try {
        if (typeof body.id === "undefined" || body.id === null) {
            console.log("Missing id field");
            return {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }

        const tripUpdate: Partial<TripsModel> = {};
        if (typeof body.price !== "undefined") {
            tripUpdate.price = body.price;
        }
        if (typeof body.duration !== "undefined") {
            tripUpdate.duration = body.duration;
        }
        if (typeof body.status !== "undefined") {
            tripUpdate.status = body.status;
        }
        if (typeof body.invoice !== "undefined") {
            tripUpdate.invoice = body.invoice;
        }
        if (typeof body.payment_intent !== "undefined") {
            tripUpdate.payment_intent = body.payment_intent;
        }
        if (typeof body.time_end !== "undefined") {
            tripUpdate.time_end = body.time_end;
        }
        if (typeof body.start_address !== "undefined") {
            tripUpdate.start_address = body.start_address;
        }
        if (typeof body.end_address !== "undefined") {
            tripUpdate.end_address = body.end_address;
        }
        if (typeof body.payment_method_id !== "undefined") {
            tripUpdate.payment_method_id = body.payment_method_id;
        }
        if (typeof body.discounted_amount !== "undefined") {
            tripUpdate.discounted_amount = body.discounted_amount;
        }
        if (typeof body.city_id !== "undefined") {
            tripUpdate.city_id = body.city_id;
        }

        await TripsModel.update(tripUpdate, {
            where: {
                id: body.id
            }
        });
        const trip = await TripsModel.findByPk(body.id);

        return {
            statusCode: 200,
            result: trip
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};
