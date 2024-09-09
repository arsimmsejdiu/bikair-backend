import GeolokitService from "./Geolokit";
import {GeoUtils, PostFormsRegisterInput} from "@bikairproject/lib-manager";

export const formsRegister = async (body: PostFormsRegisterInput) => {
    try {
        console.log("[BODY-------------]", !body.firstname);
        if (!body.address ||
            !body.city ||
            !body.lastname ||
            !body.firstname ||
            !body.birthdate ||
            !body.email ||
            !body.phone ||
            !body.zip_code) {
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

        if (client !== null) {
            console.log("Email already exist !");
            return {
                statusCode: 201
            };
        }

        const latLng: any = await GeoUtils.retrieveLatLng(body.zip_code, body.address.split(" ").join("+"));
        console.log("latLng : ", latLng);
        const typeGeoLatLngMaybe: any = [];
        if (latLng && latLng !== "NONE") {
            const formatedLatLng = JSON.parse(latLng);
            console.log("formatedLatLng", formatedLatLng);
            typeGeoLatLngMaybe.push({type: "latitude", title: "Latitude", content: formatedLatLng.lat});
            typeGeoLatLngMaybe.push({type: "longitude", title: "Longitude", content: formatedLatLng.lng});
        }
        console.log("typeGeoLatLngMaybe : ", typeGeoLatLngMaybe);

        const clientStructure = await geolokit.getClientStructure();
        const residentField = geolokit.getFieldFromStructure(clientStructure, "Résident");
        console.log("residentField = ", residentField);
        const residentContent = geolokit.getSelectFieldSlug(residentField, body.resident === "true" ? "Oui" : "Non");
        console.log("residentContent = ", residentContent);


        const params = {
            name: body.firstname + " " + body.lastname,
            type: "client",
            typeId: 1,
            fields: [
                {type: "text", title: "Prénom", content: body.firstname},
                {type: "text", title: "Nom", content: body.lastname},
                {type: "text", title: "Email", content: body.email},
                {type: "text", title: "Date de naissance", content: body.birthdate},
                {type: "text", title: "Téléphone", content: body.phone},
                {type: "text", title: "Résident", content: residentContent},

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

        await geolokit.create(params);

        console.log("Returning code 201");
        return {
            statusCode: 201
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    }
};

