import GetOpenCoords from "../dao/GetOpenCoords";

const getOpenCoords = async () => {
    const result = await GetOpenCoords();
    return {
        statusCode: 200,
        result: result
    };
};

export default getOpenCoords;
