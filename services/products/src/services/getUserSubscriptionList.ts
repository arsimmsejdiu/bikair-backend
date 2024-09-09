import {GetUserSubscriptionList} from "../dao/GetUserSubscriptionList";
import {SelectBuilderConf} from "@bikairproject/lib-manager";

export const getUserSubscriptionList = async (query: SelectBuilderConf | null) => {
    try {
        const userSubscriptions = await GetUserSubscriptionList(query);

        return {
            statusCode: 200,
            result: userSubscriptions
        };
    } catch (error) {
        console.log("[ERROR] get-products : ");
        throw error;
    }
};
