import { BikesModel,LocksModel,PutLockStateInput } from "@bikairproject/lib-manager";

const putLockState = async (body: PutLockStateInput, locale: string) => {
    try {

        const bike = await BikesModel.findByPk(body.bikeId);
        if (!bike) {
            console.log(`Bike ${body.bikeId} not found.`);
            return {
                statusCode: 404,
                result: "BIKE_NOT_FOUND"
            };
        }

        const lock = await LocksModel.findByPk(bike.lock_id);
        if (!lock) {
            console.log(`Lock ${bike.lock_id} not found.`);
            return {
                statusCode: 404,
                result: "NO_LOCKER_FOUND"
            };
        }

        console.log(`Updating lock ${lock.id} with state ${body.state}.`);
        await LocksModel.update({
            state: body.state
        }, {
            where: {
                id: lock.id
            }
        });

        return {
            statusCode: 204
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    }
};

export default putLockState;
