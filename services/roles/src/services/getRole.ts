import {AccessRights, AccessRightsModel, Roles, RolesAccessRightsModel, RolesModel} from "@bikairproject/lib-manager";

export const getRole = async (id: number) => {
    try {
        const role: Roles | null = await RolesModel.findOne({
            where: {
                id: id
            }
        });

        if (!role) {
            return {
                statusCode: 404,
                result: null
            };
        }

        const roleAccessRights = await RolesAccessRightsModel.findAll({
            where: {
                role_id: role.id
            }
        });

        const accessRights: AccessRights[] = [];
        for(const rar of roleAccessRights) {
            const accessRight = await AccessRightsModel.findByPk(rar.access_right_id);
            if(accessRight) {
                accessRights.push(accessRight);
            }
        }

        role.access_rights = accessRights.map(ar => ar.name);

        return {
            statusCode: 200,
            result: role
        };

    } catch (error) {
        console.log("[ERROR] getRole : ");
        throw error;
    }
};
