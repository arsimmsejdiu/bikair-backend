import { NotificationsModel } from "@bikairproject/lib-manager";

export const saveMessage = async (data: any) => {
    try {
        // Save message to DB
        await NotificationsModel.create({
            message: data.message,
            topic: data.topic,
            title: data.title
        });

        return true;
    } catch (err) {
        return err;
    }
};
