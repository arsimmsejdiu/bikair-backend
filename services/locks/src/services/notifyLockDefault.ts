import { MICROSERVICE_NOTIFICATION, SLACK_TOPIC } from "../config/config";
import { invokeAsync } from "@bikairproject/aws/dist/lib";
import { BikesModel, TripsModel } from "@bikairproject/lib-manager";

const putLockState = async (userId: number, lockError: string) => {
    try {
        const trip = await TripsModel.findOne({
            where: {
                user_id: userId
            },
            order: [
                ["id", "DESC"]
            ]
        });

        let bike: BikesModel | null | undefined;
        if (trip !== null) {
            bike = await BikesModel.findByPk(trip.bike_id);
        }
        let message: string;
        switch (lockError) {
            case "still-closed":
                message = `Vélo ${bike?.name} (${trip?.id}) Le trajet à commencé mais le cadenas est toujours au status "closed"`;
                break;
            case "instant-closed":
                message = `Vélo ${bike?.name} (${trip?.id}) Le cadenas est passé instantanément au statut "closed"`;
                break;
            default:
                message = `Vélo ${bike?.name} (${trip?.id}) Le cadenas à remonté un default`;
        }
        await invokeAsync(MICROSERVICE_NOTIFICATION, {
            from: "lock-error",
            message: message,
            type: "alert",
            topic: SLACK_TOPIC
        });

        return {
            statusCode: 200,
            result: "Ok"
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] lockError : ", lockError);
        throw error;
    }
};

export default putLockState;
