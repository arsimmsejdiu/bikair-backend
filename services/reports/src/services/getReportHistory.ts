import {GetReportHistory} from "../dao/GetReportHistory";

export const getReportHistory = async (bikeId: number) => {
    try {
        const result = await GetReportHistory(bikeId);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] adminId : ", bikeId);
        throw error;
    }
};
