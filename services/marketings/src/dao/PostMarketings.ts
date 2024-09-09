import { GetMarketing } from "./GetMarketing";
import {MarketingCampaignsCreate, MarketingCampaignsModel } from "@bikairproject/lib-manager";


export const PostMarketings = async (data: MarketingCampaignsCreate) => {
    const marketing = await MarketingCampaignsModel.create({
        name: data.name,
        frequency: data.frequency,
        title: data.title,
        message: data.message,
        configuration: data.configuration,
        request: data.request,
        fn_arn: data.fn_arn,
        event_rule: data.event_rule,
        uuid: data.uuid,
        status: data.status,
        replacements: data.replacements,
        date_end: data.date_end
    });
    return await GetMarketing(marketing.id);
};
