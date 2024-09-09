import {AdminMe, BIKE_TAGS, getAdminMe} from "@bikairproject/lib-manager";

const CONSTANT = {
    static_data: {
        parts: [
            "Levier frein avant",
            "Retour atelier",
            "Levier frein arriere",
            "Freinage avant",
            "Freinage arriere",
            "Eclairage avant",
            "Eclairage arriere",
            "Appuie telephone",
            "Selle",
            "Bequille",
            "Cadenas",
            "Sonnette",
            "Garde_boues",
            "Panier",
            "Reflecteurs",
            "Guidon",
            "batterie",
            "Experimentation"
        ],
        workshop: ["Entrepôt", "Terrain"],
        perimeter: 60000,
        n_bikes: 100
    }
};


/**
 *
 * @returns
 */
export const getMe = async (adminId: number) => {
    try {
        const admin: AdminMe | null = await getAdminMe(adminId);
        if (!admin) {
            return {
                statusCode: 404,
                result: `Can't find admin with id ${adminId}`
            };
        }
        console.log("Tag update --> ", admin.tag_update);
        return {
            statusCode: 200,
            result: {
                user: admin,
                STATIC_DATA: {
                    ...CONSTANT.static_data,
                    status_available: admin.status_available ?? [],
                    bike_status: admin.bike_status ?? [],
                    status_update: admin.status_update ?? [],
                    tag_available: admin.tag_available ?? [],
                    // tag_update: admin.tag_update ?? [],
                    tag_update: [...(admin.tag_update ?? []), BIKE_TAGS.EXPERIMENTATION],
                },
            },
        };
    } catch (error) {
        console.log("[ERROR] adminId : ", adminId);
        throw error;
    }
};
