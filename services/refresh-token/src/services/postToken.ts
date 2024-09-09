import * as jwt from "jsonwebtoken";

import { ACCESS_JWT_LIMIT_CLIENT, JWT_SECRET } from "../config/config";
import { SessionsModel, UsersModel } from "@bikairproject/lib-manager";

export const postToken = async (body: any) => {
    try {
        // Get refresh token --
        const refreshToken = await SessionsModel.findOne({
            where: {
                refresh_token: body.refresh_token
            },
            order: [
                ["id", "DESC"]
            ]
        });

        if (refreshToken) {
            // Generate a new authToken JWT
            const user = await UsersModel.findOne({
                where: {
                    uuid: refreshToken.user_uuid
                }
            });

            if (user && !user.is_block) {
                const token = jwt.sign({
                    userId: user.id,
                    role: "USER",
                    name: `${user.lastname} ${user.firstname}`.toLowerCase().trim(),
                    email: user.email ? user.email.toLowerCase().trim() : ""
                },
                JWT_SECRET,
                {
                    expiresIn: ACCESS_JWT_LIMIT_CLIENT
                });
                return {
                    statusCode: 201,
                    result: {
                        token: token,
                        refresh_token: refreshToken.refresh_token
                    }
                };
            }
        } else {
            return {
                statusCode: 403,
                result: null
            };
        }
    } catch (err) {
        console.log("[ERROR]", err);
        return err;
    }
};
