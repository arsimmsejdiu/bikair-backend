import {EventLogModel, PostCreateEventsInput } from "@bikairproject/lib-manager";

const createEvents = async (body: PostCreateEventsInput, locale: string) => {
    try {
        if (Array.isArray(body)) {
            for (const event of body) {
                await EventLogModel.create({
                    type: event.type,
                    metadata: event.data
                });
            }
        } else {
            await EventLogModel.create({
                type: body.type,
                metadata: body.data
            });
        }

        return {
            statusCode: 201
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        console.log("[ERROR] locale : ", locale);
        throw error;
    }
};

export default createEvents;
