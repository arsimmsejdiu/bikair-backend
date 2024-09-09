import { NODE_ENV } from "../config/config";
import { updateCronEvent } from "@bikairproject/aws/dist/lib";
import { BatchesModel, PutBatchesInput } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const putBatch = async (batchId: number, data: PutBatchesInput) => {
    try {
        if (data.status) {
            const state = data.status === "ACTIVE" ? "ENABLED" : "DISABLED";
            const batch = await BatchesModel.findByPk(batchId);
            if (batch) {
                await updateCronEvent(batch.uuid, batch.frequency, state, "Batch-"+ NODE_ENV);
            }
        }
        await BatchesModel.update({
            name: data.name,
            request: data.request,
            fn_arn: data.fn_arn,
            frequency: data.frequency,
            status: data.status,
            type: data.type
        }, {
            where: {
                id: batchId
            }
        });
        return {
            statusCode: 204,
            result: null
        };
    } catch (error) {
        console.log("[ERROR] update batch", error);
        throw error;
    }
};
