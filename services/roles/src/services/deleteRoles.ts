import {getSequelize, RolesModel } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const deleteRoles = async (roleId: number) => {
    const transaction = await getSequelize().transaction();
    try {
        await RolesModel.destroy({
            where: {
                id : roleId
            }
        });

        await transaction.commit();
        return {
            statusCode: 200,
            result: {
                id: roleId
            }
        };
    } catch (error) {
        console.log("[ERROR] Cannot delete role, rollback", error);
        console.log("[ERROR] roleId : ", roleId);
        await transaction.rollback();
        throw error;
    }
};
