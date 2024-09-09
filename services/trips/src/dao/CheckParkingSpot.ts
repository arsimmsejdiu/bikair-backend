import { QueryTypes, Transaction } from "sequelize";

import { getSequelize } from "@bikairproject/lib-manager";


export const CheckParkingSpot = async (lat: number, lng: number, transaction?: Transaction): Promise<boolean> => {
    const response =  await getSequelize().query(`
            SELECT *
            FROM city_spots 
            WHERE ST_CONTAINS(ST_SetSRID(polygon, 4326), ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)) = TRUE
                AND status = 'ACTIVE'
            LIMIT 1
    `, {
        replacements: {
            lng: lng,
            lat: lat,
        },
        raw: true,
        plain: true,
        transaction: transaction,
        type: QueryTypes.SELECT
    });

    return !!response;
};
