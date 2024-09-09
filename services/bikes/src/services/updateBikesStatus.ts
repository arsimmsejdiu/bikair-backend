import { BikesModel, PutBikesStatusInput, updateBikeStatus } from "@bikairproject/lib-manager";

export const updateBikesStatus = async (body: PutBikesStatusInput) => {
    try {
        const { bikeId, status, origin, author_id } = body;
        if (!bikeId || !status || !origin) {
            console.log("Missing required parameter");
            return {
                statusCode: 409,
                result: "Missing required parameter"
            };
        }

        await updateBikeStatus(bikeId, status, origin, author_id);

        const bike = await BikesModel.findByPk(body.id);

        return {
            statusCode: 200,
            result: bike
        };
    } catch (error) {
        console.log("[ERROR] Body : ", body);
        throw error;
    }
};
