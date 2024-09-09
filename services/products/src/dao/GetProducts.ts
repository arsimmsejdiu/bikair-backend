import { QueryTypes } from "sequelize";

import { getSequelize } from "@bikairproject/lib-manager";

export const GetProducts = async () => {
    return await getSequelize().query(`
                            SELECT 
                                p.*,
                                CASE WHEN COUNT(pv.product_id) = 0 THEN NULL
                                    ELSE ARRAY_AGG(ROW_TO_JSON(pv)) 
                                END AS variations
                            FROM products p
                                LEFT JOIN product_variations pv ON pv.product_id = p.id
                            GROUP BY p.id;
    `, {
        type: QueryTypes.SELECT
    });
};
