import {GetBikesCollector} from "../dao/GetBikesCollector";
import {GetBikesController} from "../dao/GetBikesController";
import {GetBikesItinerant} from "../dao/GetBikesItinerant";
import {GetBikesMaintainer} from "../dao/GetBikesMaintainer";
import {GetBikesTechnician} from "../dao/GetBikesTechnician";
import {
    AccessRights,     AccessRightsModel,
    AdminCitiesModel,
    AdminsModel,
    BikeTechnician, DataCacheResult,
    RolesAccessRightsModel,
    RolesModel} from "@bikairproject/lib-manager";

const getCityIds = async (adminId: number) => {
    const cities = await AdminCitiesModel.findAll({
        where: {
            admin_id: adminId
        }
    });
    return cities.map(city => city.city_id);
};

/**
 *
 * @returns
 */
export const getBikesTechnician = async (adminId: number, lastUpdate: number | null) => {
    try {
        const admin = await AdminsModel.findByPk(adminId);

        if (!admin) {
            return {
                statusCode: 403,
                result: "Vous n'avez pas le droit d'acceder à cette resource."
            };
        }

        const role = await RolesModel.findByPk(admin.role_id);

        if (!role) {
            return {
                statusCode: 403,
                result: "Vous n'avez pas le droit d'acceder à cette resource."
            };
        }

        const roleAccessRights = await RolesAccessRightsModel.findAll({
            where: {
                role_id: role.id
            }
        });
        const accessRightIds = roleAccessRights.map(rar => rar.access_right_id);
        const accessRights: AccessRights[] = await AccessRightsModel.findAll({
            where: {
                id: accessRightIds
            }
        });

        const cityIds = await getCityIds(adminId);
        console.log("cityIds = ", cityIds);
        console.log(`Get available bike status for role ${role.name} for user ${adminId}`);
        const statusValue = accessRights
            .filter(ar => ar.category === "BIKE_STATUS_READ")
            .map(ar => ar.name.replace("_READ", ""));
        console.log("statusValue = ", statusValue);
        const tagsValue = accessRights
            .filter(ar => ar.category === "BIKE_TAG_READ")
            .map(ar => ar.name.replace("_READ", ""));
        console.log("tagsValue = ", tagsValue);

        let result: DataCacheResult<BikeTechnician>;
        console.log("Fetching bikes for role ", role.name);
        switch (role.name) {
            case "COLLECTOR":
                result = await GetBikesCollector(cityIds, statusValue, tagsValue, lastUpdate);
                break;
            case "CONTROLLER":
                result = await GetBikesController(cityIds, statusValue, tagsValue, lastUpdate);
                break;
            case "MAINTAINER":
                result = await GetBikesMaintainer(cityIds, statusValue, tagsValue, lastUpdate);
                break;
            case "ITINERANT":
                result = await GetBikesItinerant(cityIds, statusValue, tagsValue, lastUpdate);
                break;
            default:
                result = await GetBikesTechnician(cityIds, statusValue, lastUpdate);
        }

        console.log("Nb Bikes : ", result.total);

        return {
            statusCode: 200,
            result: result
        };
    } catch (error) {
        console.log("[ERROR] adminId : ", adminId);
        console.log("[ERROR] lastUpdate : ", lastUpdate);
        throw error;
    }
};
