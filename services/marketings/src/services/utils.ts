import { MarketingCampaigns, MarketingCampaignsCreate, MarketingCampaignsUpdate } from "@bikairproject/lib-manager";

export const splitTranslations = <T extends MarketingCampaigns | MarketingCampaignsCreate | MarketingCampaignsUpdate>(marketingCampaign: T): T => {
    if (marketingCampaign) {
        const marketing = Object.assign({}, marketingCampaign);
        marketing.title_fr = marketing.title?.fr;
        marketing.title_en = marketing.title?.en;
        marketing.message_fr = marketing.message?.fr;
        marketing.message_en = marketing.message?.en;
        return marketing;
    } else {
        return marketingCampaign;
    }
};
export const mergeTranslations = <T extends MarketingCampaigns | MarketingCampaignsCreate | MarketingCampaignsUpdate>(marketingCampaign: T): T => {
    if (marketingCampaign) {
        const marketing = Object.assign({}, marketingCampaign);
        marketing.title = {
            fr: marketing.title_fr ?? "",
            en: marketing.title_en ?? ""
        };
        marketing.message = {
            fr: marketing.message_fr ?? "",
            en: marketing.message_en ?? ""
        };
        return marketing;
    } else {
        return marketingCampaign;
    }
};
