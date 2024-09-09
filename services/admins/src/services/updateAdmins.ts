import { getAdmin } from "./getAdmin";
import { hashing } from "./hashing";
import { AdminCitiesModel, AdminsModel, CitiesModel, getSequelize, PutAdminsInput } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const updateAdmins = async (body: PutAdminsInput, locale: string) => {
    const transaction = await getSequelize().transaction();
    try {
        if (
            !body.id ||
            !body.lastname ||
            !body.firstname ||
            !body.username ||
            !body.role_id
        ) {
            console.log("Missing required params");
            return {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }

        if (body.password) {
            body.password = await hashing(body.password);
        }

        console.log("update admin city");
        if (body.city_names) {
            await AdminCitiesModel.destroy({
                where: {
                    admin_id: body.id
                },
                transaction: transaction
            });

            const cities = await CitiesModel.findAll({
                where: {
                    name: body.city_names
                }
            });

            if (cities) {
                const cityIds = cities.map((city) => city.id);
                for (const cityId of cityIds) {
                    await AdminCitiesModel.create(
                        {
                            admin_id: body.id,
                            city_id: cityId
                        },
                        { transaction: transaction }
                    );
                }
            }
        }

        console.log("update admins");
        await AdminsModel.update(body, {
            where: {
                id: body.id
            },
            transaction: transaction
        });

        console.log("commit");
        await transaction.commit();

        const admin = await getAdmin(body.id);
        return {
            statusCode: 200,
            result: admin.result
        };
    } catch (error) {
        console.log("[ERROR] Cannot update admins, rollback...", error);
        console.log("[ERROR] Body : ", body);
        console.log("[ERROR] locale : ", locale);
        await transaction.rollback();
        throw error;
    }
};
