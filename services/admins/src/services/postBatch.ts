import { NODE_ENV } from "../config/config";
import { deleteBatch } from "./deleteBatch";
import { createCronEvent } from "@bikairproject/aws/dist/lib";
import { BatchesModel, PostBatchesInput } from "@bikairproject/lib-manager";

/**
 *
 * @param data
 * @returns
 */
export const postBatch = async (data: PostBatchesInput) => {
    let batch;
    try {
        // Create the new batch
        data.fn_arn = data.fn_arn || `arn:aws:lambda:eu-west-3:962351136828:function:bikair-admins-${NODE_ENV}-play-batch`;
        const state = data.status === "ACTIVE" ? "ENABLED" : "DISABLED";

        batch = await BatchesModel.create({
            name: data.name,
            request: data.request,
            frequency: data.frequency,
            status: data.status,
            fn_arn: data.fn_arn,
            type: data.type,
            event_rule: data.event_rule ?? null
        });
        if (!batch || !batch.id || !batch.uuid || !batch.frequency || !batch.fn_arn) {
            throw new Error("Error while creating batch entity");
        }

        // Create a cronjob associated in aws
        const eventRule = await createCronEvent(batch.uuid, batch.frequency, batch.fn_arn, state, data.name);
        await BatchesModel.update({
            event_rule: eventRule,
            status: batch.status
        }, {
            where: {
                id: batch.id
            }
        });
        batch.event_rule = eventRule;
        return {
            statusCode: 201,
            result: batch
        };
    } catch (error) {
        console.log("[ERROR] creating batch", error);
        // Rollback if error
        if(batch){
            await deleteBatch(batch.id);
        }
        throw error;
    }
};
