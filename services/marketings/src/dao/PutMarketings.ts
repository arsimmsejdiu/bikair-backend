import {GetMarketing} from "./GetMarketing";
import {updateCronEvent} from "@bikairproject/aws/dist/lib";
import {MarketingCampaignsModel,MarketingCampaignsUpdate} from "@bikairproject/lib-manager";


export const PutMarketings = async (data: MarketingCampaignsUpdate) => {
    const marketing = await MarketingCampaignsModel.findByPk(data.id);
    if (marketing) {
        const state = data?.status ?? marketing.status === "ACTIVE" ? "ENABLED" : "DISABLED";
        const description = data?.name ?? marketing.name;
        const frequency = data?.frequency ?? marketing.frequency;
        await updateCronEvent(marketing.uuid, frequency, state, description);

        await MarketingCampaignsModel.update(data, {
            where: {
                id: data.id
            }
        });
    }

    return await GetMarketing(data.id);
};
