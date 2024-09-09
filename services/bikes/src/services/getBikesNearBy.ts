import { GetBikesNearBy } from "../dao/GetBikesNearBy";
import {BIKE_STATUS, closeConnection} from "@bikairproject/lib-manager";

export const getBikesNearBy = async (origin: string, appVersion: string, query: any) => {
    try {
        let coords: (string | null | undefined)[] = [null, null, undefined];
        let limit, offset, status, lastUpdate, tag, lat, lng, perimeter;

        if (query && query.latlng) {
            const decodedCoords: string = decodeURIComponent(query.latlng);
            coords = decodedCoords.split(",");
            lng = coords[0] ? parseFloat(coords[0]) : undefined;
            lat = coords[1] ? parseFloat(coords[1]) : undefined;
            perimeter = coords[2] ? parseInt(coords[2]) : undefined;
        }
        if (query && query.lat && query.lng) {
            lat = query.lat;
            lng = query.lng;
        }
        if (query && query.perimeter) {
            perimeter = query.perimeter;
        }
        if (query && query.limit) {
            limit = query.limit;
        }
        if (query && query.offset) {
            offset = query.offset;
        }
        if (query && query.status) {
            status = query.status;
        }
        if (query && query.lastUpdate) {
            lastUpdate = query.lastUpdate;
        }
        if (query && query.tag) {
            tag = query.tag;
        }

        const statusValue = [BIKE_STATUS.AVAILABLE];
        console.log("statusValue = ", statusValue);

        const result = await GetBikesNearBy(statusValue, lng, lat, perimeter, limit, offset, lastUpdate, tag);
        result.lastUpdate = null;

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] origin : ", origin);
        console.log("[ERROR] query : ", query);
        throw error;
    }finally{
        await closeConnection();
    }
};
