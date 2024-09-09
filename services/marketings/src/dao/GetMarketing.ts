import { splitTranslations } from "../services/utils";
import {MarketingCampaigns, MarketingCampaignsModel } from "@bikairproject/lib-manager";

export const GetMarketing = async (id: number): Promise<MarketingCampaigns | null> => {
    let marketing: MarketingCampaigns | null = await MarketingCampaignsModel.findOne({
        where: {
            id: id
        }
    });
    if(marketing) {
        marketing = splitTranslations(marketing);
        return marketing;
    } else {
        return null;
    }
};
