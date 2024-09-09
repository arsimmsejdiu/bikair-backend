import { deleteCronEvent } from "@bikairproject/aws/dist/lib";
import { BatchesModel } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const deleteBatch = async (batchId: number) => {
    try {
        const batch = await BatchesModel.findByPk(batchId);
        if (batch) {
            await deleteCronEvent(batch.uuid, batch.fn_arn);
        }
        await BatchesModel.destroy({
            where: {
                id: batchId
            }
        });
        return {
            statusCode: 204,
            result: null
        };
    } catch (error) {
        console.log("[ERROR] creating batch", error);
        throw error;
    }
};
