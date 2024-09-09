import { PlayMarketings } from "../dao/PlayMarketings";
import { closeConnection,loadSequelize } from "@bikairproject/lib-manager";

export const playMarketings = async (eventRule: string) => {
    try {
        await loadSequelize();
        await PlayMarketings(eventRule);

    } catch (error) {
        console.log("[ERROR] playMarketings : ", error);
        throw error;
    }finally{
        await closeConnection();
    }
};
