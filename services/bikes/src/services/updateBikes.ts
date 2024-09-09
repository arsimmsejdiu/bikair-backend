import {GetBikeDetail} from "../dao/GetBikeDetail";
import {updateBikesStatus} from "./updateBikesStatus";
import {BikesModel, CitiesModel,PutBikesInput} from "@bikairproject/lib-manager";

export const updateBikes = async (authorId: number, origin: string, body: PutBikesInput) => {
    try {
        if (!body.id) {
            console.log("Missing required parameter id");
            return {
                statusCode: 409,
                result: "Missing required parameter id"
            };
        }

        console.log(body);

        if (typeof body.status !== "undefined") {
            await updateBikesStatus({bikeId: body.id, status: body.status, origin: origin, author_id: authorId});
            delete body.status;
        }

        if (body.city_name) {
            const city = await CitiesModel.findOne({
                where: {
                    name: body.city_name
                }
            });

            if (city) {
                body.city_id = city.id;
            }
        }

        await BikesModel.update(body, {
            where: {
                id: body.id
            }
        });

        const bike = await GetBikeDetail(body.id);

        return {
            statusCode: 200,
            result: bike
        };
    } catch (error) {
        console.log("[ERROR] Body : ", body);
        throw error;
    }
};
