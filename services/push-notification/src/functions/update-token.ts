import {PutToken} from "../dao/PutToken";
import {HandlerWithTokenAuthorizerBuilder} from "@bikairproject/lib-manager";

/** @deprecated in favor of put-user-setting in services/users*/
/**
 * This will update device token for a specific user,
 * this is need to send firebase-message to specific user
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns
 */
export const handler = HandlerWithTokenAuthorizerBuilder<{token: string}, string>(async request => {
    const body = request.body;
    const userId = request.userId;
    const headers = request.headers;

    if(!body?.token || !userId){
        return {
            statusCode: 404,
            body: "Missing parameters"
        };
    }

    return await PutToken(body.token, userId, headers);
});
