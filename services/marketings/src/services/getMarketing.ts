import { GetMarketing } from "../dao/GetMarketing";

export const getMarketing = async (id: number) => {
    try {
        const marketing = await GetMarketing(id);

        if (!marketing) {
            return {
                statusCode: 404,
                result: null
            };
        }

        return {
            statusCode: 200,
            result: marketing
        };
    } catch (error) {
        console.log("[ERROR] getMarketing : ");
        throw error;
    }
};
