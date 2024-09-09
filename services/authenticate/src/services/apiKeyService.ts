import { QueryTypes } from "sequelize";

import { ApiKeyModel, getSequelize } from "@bikairproject/lib-manager";

export const checkApiKey = async (key: string, appVersion: string, origin: string) => {
    try {
        const apiKey = await ApiKeyModel.findOne({
            where: {
                active: true,
                key: key
            }
        });

        const apiKeyUpdate = await getSequelize().query(`
                SELECT *
                FROM api_key
                WHERE (STRING_TO_ARRAY(version_app, '.')::INT[] > STRING_TO_ARRAY(:appVersion, '.')::INT[])
                AND available = TRUE
                AND type = :origin
        `, {
            replacements: {
                appVersion: appVersion,
                origin: origin
            },
            raw: true,
            plain: true,
            type: QueryTypes.SELECT
        });

        const isUpdate = typeof apiKeyUpdate !== "undefined" && apiKeyUpdate !== null;
        const isValid = typeof apiKey !== "undefined" && apiKey !== null;

        return {
            statusCode: 200,
            result: {
                is_valid: isValid,
                apiKey: apiKey,
                isUpdate: isUpdate
            }
        };


    } catch (error) {
        console.log(`Error finding api key ${key}`);
        throw error;
    }
};
