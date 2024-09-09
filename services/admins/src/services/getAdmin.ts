import {AdminCitiesModel, Admins, AdminsModel, CitiesModel, ROLES, RolesModel} from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const getAdmin = async (adminId: number) => {
    try {
        const admin: Admins | null = await AdminsModel.findByPk(adminId);

        if (!admin) {
            return {
                statusCode: 404,
                result: `Can't find admin with id ${adminId}`
            };
        }

        const role = await RolesModel.findByPk(admin.role_id);

        const adminCities = await AdminCitiesModel.findAll({
            where: {
                admin_id: adminId
            }
        });
        const city_ids = adminCities.map((c) => c.city_id);

        const adminCitiesNames = await CitiesModel.findAll({
            where: {
                id: city_ids
            }
        });
        const citiesNames = adminCitiesNames.map((c) => c.name);

        return {
            statusCode: 200,
            result: {
                ...admin,
                password: "placeholder",
                roles: [role?.name ?? ROLES.TECHNICIAN],
                role: role?.name ?? ROLES.TECHNICIAN,
                city_names: citiesNames,
                lock_access: role?.name === "SUPER_ADMIN",
                update_address: role?.name === "SUPER_ADMIN"
            }
        };
    } catch (error) {
        console.log("[ERROR] adminId : ", adminId);
        throw error;
    }
};
