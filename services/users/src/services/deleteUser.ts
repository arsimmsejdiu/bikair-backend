import { UserSettingsModel,UsersModel } from "@bikairproject/lib-manager";

const makeId = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};

const generateFakePhone = () => {
    const n = Math.floor(10000000 + Math.random() * 900000000);
    return `+330${n}`;
};

const generateFakeEmail = () => {
    const s = makeId(10);
    return `${s}@deleted.com`;
};

export const deleteUser = async (userId: number) => {
    try {
        const userToDelete = await UsersModel.findByPk(userId);

        if(userToDelete?.stripe_customer) {
            const email = generateFakeEmail();
            const phone = generateFakePhone();
            await UsersModel.update({
                is_block: true,
                lastname: "**********",
                firstname: "**********",
                phone: phone,
                email: email
            }, {
                where: {
                    id: userId
                }
            });

            await UserSettingsModel.destroy({
                where: {
                    user_id: userId
                }
            });
        }

        return {
            statusCode: 200
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        throw error;
    }
};
