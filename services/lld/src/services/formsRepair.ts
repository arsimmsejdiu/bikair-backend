import {IPoiInput} from "../lib/IGeolokit";
import GeolokitService from "./Geolokit";
import {GeoUtils, PostFormsRepairInput} from "@bikairproject/lib-manager";

export const formsRepair = async (body: PostFormsRepairInput) => {
    try {
        if (!body.email ||
            !body.type ||
            !body.date ||
            !body.slot ||
            !body.address ||
            !body.zip_code ||
            !body.city ||
            !body.payment_method) {
            console.log("Missing required params");

            return {
                statusCode: 400,
                result: "Missing parameters"
            };
        }

        console.log("init Geolockit service");
        const geolokit = new GeolokitService();
        console.log("Geolockit auth");
        await geolokit.auth();
        console.log("get Geolockit user");
        const client = await geolokit.getUserInformation(body.email);
        console.log("client  = ", client);

        const latLng: any = await GeoUtils.retrieveLatLng(body.zip_code, body.address.split(" ").join("+"));
        console.log("latLng : ", latLng);
        const typeGeoLatLngMaybe: any = [];
        if (latLng && latLng !== "NONE") {
            const formatedLatLng = JSON.parse(latLng);
            typeGeoLatLngMaybe.push({type: "latitude", title: "Latitude", content: formatedLatLng.lat});
            typeGeoLatLngMaybe.push({type: "longitude", title: "Longitude", content: formatedLatLng.lng});
        }
        console.log("typeGeoLatLngMaybe : ", typeGeoLatLngMaybe);

        const [year, month, day] = body.date.split("-");
        const [start, end] = body.slot.split(" - ");
        const [startHour, startMinute] = start.split(":");
        const [endHour, endMinute] = end.split(":");
        const dateStart = `${year}-${month}-${day} ${startHour}:${startMinute}:00`;
        const dateEnd = `${year}-${month}-${day} ${endHour}:${endMinute}:00`;

        const repairStructure = await geolokit.getRepairStructure();
        console.log("repairStructure = ", repairStructure);

        const typeField = geolokit.getFieldFromStructure(repairStructure, "Type d'intervention");
        console.log("typeField = ", typeField);
        const typeContent = geolokit.getSelectFieldSlug(typeField, "Réparation");
        console.log("typeContent = ", typeContent);
        const paymentField = geolokit.getFieldFromStructure(repairStructure, "Moyen de payement");
        console.log("paymentField = ", paymentField);
        const paymentContent = geolokit.getSelectFieldSlug(paymentField, body.payment_method);
        console.log("paymentContent = ", paymentContent);

        const bikeRef = client.references.filter(r => r.type === "velo")[0];
        const paramRef = bikeRef ? [{
            pk_id: Number(client.pk_id),
            type: String(client.type),
        }, bikeRef] : [{
            pk_id: Number(client.pk_id),
            type: String(client.type),
        }];

        const params: IPoiInput = {
            type: "intervention",
            typeId: 4,
            fields: [
                {type: "text", title: "Référence", content: body.reference},
                {type: "text", title: "Email", content: body.email},
                {type: "text", title: "Type d'intervention", content: typeContent},
                {type: "text", title: "Type de réparation", content: body.type},
                {type: "text", title: "Moyen de payement", content: paymentContent},
                {type: "datestart", title: "datestart", content: dateStart},
                {type: "dateend", title: "dateend", content: dateEnd},
                {type: "address", title: "Adresse", content: body.address},
                {type: "postcode", title: "Code postal", content: body.zip_code},
                {type: "city", title: "Ville", content: body.city},
                {type: "location", title: "Adresse", content: body.address},
                {type: "postcode", title: "postcode", content: body.zip_code},
                {type: "city", title: "city", content: body.city},
                ...typeGeoLatLngMaybe
            ]
        };
        console.log("params : ", params);

        const poiId = await geolokit.create(params);
        console.log("poiId = ", poiId);
        const createdInter = await geolokit.getPoiById(poiId);
        createdInter.references = paramRef;
        await geolokit.update(poiId, createdInter);

        console.log("Returning code 201");
        return {
            statusCode: 201,
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
