import { getAdmin } from "./getAdmin";
import { hashing } from "./hashing";
import { AdminCitiesModel, AdminsModel, CitiesModel, getSequelize, PostAdminsInput } from "@bikairproject/lib-manager";

/**
 *
 * @returns
 */
export const createAdmins = async (body: PostAdminsInput, localeHeader: string) => {
    const transaction = await getSequelize().transaction();

    try {
        if (
            !body.lastname ||
            !body.firstname ||
            !body.password ||
            !body.username ||
            !body.role_id
        ) {
            console.log("Missing required params");
            return {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }

        const hash = await hashing(body.password);

        const {
            email,
            username,
            lastname,
            firstname,
            phone,
            city_names,
            locale = "fr",
            role_id
        } = body;

        const newAdmin = await AdminsModel.create({
            email: email,
            username: username,
            lastname: lastname,
            firstname: firstname,
            phone: phone,
            password: hash,
            locale: locale,
            role_id: role_id
        },
        { transaction: transaction }
        );

        // Create AdminCitiesModel
        if (city_names) {
            const cities = await CitiesModel.findAll({
                where: {
                    name: city_names
                }
            });
            for (const city of cities) {
                await AdminCitiesModel.create(
                    {
                        admin_id: newAdmin.id,
                        city_id: city.id
                    },
                    { transaction: transaction }
                );
            }
        }

        await transaction.commit();

        const admin = await getAdmin(newAdmin.id);
        return {
            statusCode: 201,
            result: admin.result
        };
    } catch (error) {
        console.log("[ERROR] Cannot create admins, rollback...", error);
        console.log("[ERROR] Body : ", body);
        console.log("[ERROR] locale : ", localeHeader);
        await transaction.rollback();
        throw error;
    }
};
