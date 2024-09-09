import { createPreSignUrl } from "@bikairproject/aws/dist/lib/presign-upload";
import { PreSignedUrlInput } from "@bikairproject/shared";

export const createPreSignedUrl = async (body: PreSignedUrlInput) => {
    try {
        const { tags, bucket_name, type } = body;

        console.log("Tags = ", tags);
        console.log("bucket_name = ", bucket_name);
        console.log("type = ", type);

        const response = await createPreSignUrl(tags, bucket_name, type);

        console.log("Response = ", response);

        return {
            statusCode: 201,
            result: response
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
