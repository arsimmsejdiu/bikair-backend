import {QueryTypes} from "sequelize";
import {GetCityRedZoneOutput, getSequelize} from "@bikairproject/lib-manager";

export const GetCityRedZone = async (redZoneId: number)=> {
    return await getSequelize().query<GetCityRedZoneOutput>(`
        SELECT crz.*,
               c.name AS city_name
        from city_red_zones crz
                 LEFT OUTER JOIN cities c ON crz.id = c.id

    `, {
        replacements: {
            redZoneId: redZoneId
        },
        raw: true,
        plain: true,
        type: QueryTypes.SELECT
    })
}
