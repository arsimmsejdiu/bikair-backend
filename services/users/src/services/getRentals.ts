import {RentalsModel} from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const getRentals = async (userId: number) => {
    try {
        const rentals = await RentalsModel.findAll({
            where: {
                user_id: userId,
                status: ["LINKED"]
            }
        });
        console.log(`Found ${rentals.length} rentals.`);

        return {
            statusCode: 200,
            result: rentals
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
