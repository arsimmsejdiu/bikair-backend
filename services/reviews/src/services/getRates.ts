import { GetRates } from "../dao/GetRates";

export const getRates = async () => {
    const result = await GetRates();
    return {
        statusCode: 200,
        result: result
    };
};
