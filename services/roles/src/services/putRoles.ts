import {getRole} from "./getRole";
import {AccessRightsModel, getSequelize, PutRolesInput, RolesAccessRightsModel, RolesModel} from "@bikairproject/lib-manager";

export const putRoles = async (data: PutRolesInput) => {
    const transaction = await getSequelize().transaction();
    try {

        if (!data.access_rights) {
            console.log("Missing parameter");
            return {
                statusCode: 409,
                result: ""
            };
        }

        await RolesModel.update(data, {
            where: {
                id: data.id
            },
            transaction: transaction
        });

        if (data.access_rights) {
            await RolesAccessRightsModel.destroy({
                where: {
                    role_id: data.id
                },
                transaction: transaction
            });

            const accessRights = await AccessRightsModel.findAll({
                where: {
                    name: data.access_rights
                },
                transaction: transaction
            });

            const accessRightsIds = accessRights.map((r) => r.id);
            for (const accessRightsId of accessRightsIds) {
                await RolesAccessRightsModel.create(
                    {
                        role_id: data.id,
                        access_right_id: accessRightsId
                    },
                    {transaction: transaction}
                );
            }
        }

        await transaction.commit();

        return getRole(data.id);
    } catch (error) {
        console.log("[ERROR] putRoles : ");
        await transaction.rollback();
        throw error;
    }
};
