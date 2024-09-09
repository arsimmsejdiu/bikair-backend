import { deleteCronEvent } from "@bikairproject/aws/dist/lib";
import { MarketingCampaignsModel} from "@bikairproject/lib-manager";

export const DeleteMarketings = async (id: number) => {

    const marketing = await MarketingCampaignsModel.findByPk(id);
    if(marketing){
        await deleteCronEvent(marketing.uuid, marketing.fn_arn);
    }

    return await MarketingCampaignsModel.destroy({
        where: {
            id: id
        }
    });
};
