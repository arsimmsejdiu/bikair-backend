import { QueryTypes } from "sequelize";

import { getSequelize, UsersModel } from "@bikairproject/lib-manager";

export const findUserByPhone = async (phone) => {
    try {
        return await getSequelize().query<UsersModel>(`
            select *
            from users
            where phone = :phone
        `, {
            replacements: { phone: phone },
            raw: true,
            plain: true,
            type: QueryTypes.SELECT
        });
    } catch (error) {
        console.log(`Error finding user by phone ${phone}`);
        throw error;
    }
};

export const validatePhone = async (phone, otp) => {
    try {
        return await getSequelize().query<UsersModel>(`
            select *
            from users
            where phone = :phone
              and otp = :otp
        `, {
            replacements: {
                phone: phone,
                otp: otp
            },
            raw: true,
            plain: true,
            type: QueryTypes.SELECT
        });
    } catch (error) {
        console.log(`Error finding user with phone ${phone} and otp ${otp}`);
        throw error;
    }
};
