import {TripStatusModel} from "@bikairproject/lib-manager";

export const getTripStatusHistory = async (id: number) => {
    try {
        const tripStatus = await TripStatusModel.findAll({
            where: {
                trip_id: id
            }
        });
        return {
            statusCode: 200,
            result: tripStatus
        };
    }catch(err){
        console.log("[ERROR] getTripStatusHistory - id : ", id);
        throw err;
    }
};
