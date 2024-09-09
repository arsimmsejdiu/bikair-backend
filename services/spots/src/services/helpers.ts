import * as turf from "@turf/turf";

// https://turfjs.org/
export const generatePolygonBaseAroundCenterPoint = (latitude: number, longitude: number, max_bikes: number) => {
    const long = 8 + max_bikes;
    const larg = 8 + max_bikes;

    const centerPoint = turf.point([longitude, latitude]);
    const southwest = turf.destination(centerPoint, larg, 225, { units: "meters" });
    const northwest = turf.destination(centerPoint, long, 315, { units: "meters" });
    const northeast = turf.destination(centerPoint, larg, 45, { units: "meters" });
    const southeast = turf.destination(centerPoint, long, 135, { units: "meters" });

    const coordinates = [
        turf.getCoord(southwest),
        turf.getCoord(northwest),
        turf.getCoord(northeast),
        turf.getCoord(southeast),
        turf.getCoord(southwest)
    ];

    const rectangle = turf.polygon([coordinates]);
    return rectangle.geometry.coordinates[0];
};
