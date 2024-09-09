import { AdminCitiesModel, AdminRolesModel, AdminsModel, getSequelize } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const deleteAdmin = async (adminId: number) => {
    const transaction = await getSequelize().transaction();
    try {
        await AdminRolesModel.destroy({
            where: {
                admin_id: adminId
            },
            transaction: transaction
        });

        await AdminCitiesModel.destroy({
            where: {
                admin_id: adminId
            },
            transaction: transaction
        });

        await AdminsModel.destroy({
            where: {
                id: adminId
            },
            transaction: transaction
        });

        await transaction.commit();
        return {
            statusCode: 200,
            result: {
                id: adminId
            }
        };
    } catch (error) {
        console.log("[ERROR] Cannot delete admin, rollback", error);
        console.log("[ERROR] adminId : ", adminId);
        await transaction.rollback();
        throw error;
    }
};
