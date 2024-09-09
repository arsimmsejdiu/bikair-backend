import {AdminsModel} from "@bikairproject/lib-manager";

export const createAdmin = async (email: string, username: string, lastname: string, firstname: string, phone: string, hash: string, role_id: number) => {
    try {
        const admin = await AdminsModel.create({
            email: email,
            username: username,
            lastname: lastname,
            firstname: firstname,
            phone: phone || null,
            password: hash,
            locale: "fr",
            role_id: role_id
        });

        if (admin === null) {
            return null;
        }

        return admin;
    } catch (error) {
        console.log(`Error while creating admin ${username}`);
        throw error;
    }
};
