import { saveTripPhoto } from "../services/saveTripPhoto";
import { HandlerWithTokenAuthorizerBuilder,  PostSaveTripPhotoInput,PostSaveTripPhotoOutput } from "@bikairproject/lib-manager";

export const handler = HandlerWithTokenAuthorizerBuilder<PostSaveTripPhotoInput, PostSaveTripPhotoOutput>(async request => {
    const userId = request.userId;
    const body = request.body;
    const locale = request.locale;

    if (Number.isNaN(userId) || !body) {
        return {
            statusCode: 400,
            result: "Missing parameter user-id"
        };
    }

    return await saveTripPhoto(userId, body, locale);
});
