import {getBookings} from "../services/getBookings";
import {GetBookingsOutput, GetCurrentBookingInput,HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<GetCurrentBookingInput, GetBookingsOutput>(async request => {
    const query = request.selectQuery ?? null;

    return await getBookings(query);
});
