import { TripDepositsModel } from "@bikairproject/lib-manager";

const updateDepositStatus = async (depositId: number, status = "ACTIVE") => {
    try {
        await TripDepositsModel.update({
            status: status
        }, {
            where: {
                id: depositId
            }
        });

        return {
            statusCode: 204,
            result: null
        };
    } catch (error) {
        console.log("[ERROR] depositId : ", depositId);
        throw error;
    }
};

export default updateDepositStatus;
