import {KEYSAFE_API_KEY} from "../config/config";
import {getBikeDetail} from "./getBikeDetail";
import {KeysafeCloud} from "@bikairproject/axa-api";
import {BikesModel, getSequelize, LocksModel,PutBikeLockInput} from "@bikairproject/lib-manager";

export const updateBikeLock = async (body: PutBikeLockInput) => {
    const transaction = await getSequelize().transaction();
    try {

        const {bikeId, lockUid, lockClaimCode, lockVersion} = body;

        if (!bikeId || !lockUid || !lockClaimCode || !lockVersion) {
            console.warn("Missing parameters.");
            return {
                statusCode: 409,
                result: "Champs requis manquant."
            };
        }

        const oldLock = await LocksModel.findOne({
            where: {
                bike_id: bikeId,
                status: "ACTIVE"
            }
        });
        await LocksModel.update({
            status: "INACTIVE"
        }, {
            where: {
                bike_id: bikeId
            }
        });

        const keysafeCloud = new KeysafeCloud(KEYSAFE_API_KEY);
        // set old lock status to "stored" (use keysafeCloud.setLockStatus)
        if(oldLock?.keysafe_id){
            await keysafeCloud.changeStatus("stored", oldLock.keysafe_id);
        }

        const claimedLock = await keysafeCloud.claimLock(lockClaimCode, lockUid);
        // set new lock status to "active" (use keysafeCloud.setLockStatus)
        await keysafeCloud.changeStatus("active", claimedLock.id);


        const newLock = await LocksModel.create({
            bike_id: bikeId,
            uid: claimedLock.lock_uid,
            mac: claimedLock.mac_address,
            keysafe_id: claimedLock.id,
            state: "CLOSED",
            status: "ACTIVE",
            version: lockVersion
        }, {
            transaction: transaction
        });

        await BikesModel.update({
            lock_id: newLock.id
        }, {
            where: {
                id: bikeId
            },
            transaction: transaction
        });

        await transaction.commit();

        const bike = await getBikeDetail(bikeId);

        return {
            statusCode: 200,
            result: bike.result
        };
    } catch (error) {
        console.log("[ERROR] Body : ", body);
        await transaction.rollback();
        throw error;
    }
};
