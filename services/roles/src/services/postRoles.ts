import {getRole} from "./getRole";
import {AccessRightsModel, PostRolesInput, RolesAccessRightsModel, RolesModel} from "@bikairproject/lib-manager";

export const postRoles = async (body: PostRolesInput) => {
    try {
        if (!body.name || !body.description || !body.active || !body.access_rights) {
            console.log("Missing parameter");
            return {
                statusCode: 409,
                result: ""
            };
        }

        const role = await RolesModel.create({
            name: body.name,
            active: body.active,
            description: body.description
        });

        for(const ar of body.access_rights) {
            const accessRight = await AccessRightsModel.findOne({
                where: {
                    name: ar
                }
            });
            if(accessRight) {
                await RolesAccessRightsModel.create({
                    role_id: role.id,
                    access_right_id: accessRight.id
                });
            }

        }

        return await getRole(role.id);
    } catch (error) {
        console.log("[ERROR] postRoles : ");
        throw error;
    }
};
