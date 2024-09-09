import { QueryTypes } from "sequelize";

import { GetOpenCoordsOutputData,getSequelize} from "@bikairproject/lib-manager";


const GetOpenCoords = async () => {
    const response = await getSequelize().query<GetOpenCoordsOutputData>(`
        select json_build_array(metadata -> 'position' -> 'longitude',
                                metadata -> 'position' -> 'latitude') as coordinates
        from event_log e
        where e.type = 'USER_OPEN_APP'
    `, {
        raw: false,
        plain: false,
        type: QueryTypes.SELECT
    });

    return response ?? [];
};

export default GetOpenCoords;
