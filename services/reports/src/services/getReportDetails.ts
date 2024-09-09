import {GetReportDetail} from "../dao/GetReportDetail";

export const getReportDetails = async (bikeId: number) => {
    try {
        const result = await GetReportDetail(bikeId);
        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] adminId : ", bikeId);
        throw error;
    }
};
