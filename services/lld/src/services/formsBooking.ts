import {IPoiInput} from "../lib/IGeolokit";
import GeolokitService from "./Geolokit";
import {DateUtils, PostFormsBookingInput} from "@bikairproject/lib-manager";

export const formsBooking = async (body: PostFormsBookingInput) => {
    try {
        if (!body.email ||
            !body.type ||
            !body.start_date ||
            !body.duration ||
            !body.identity_type ||
            !body.identity_file ||
            !body.residency_type ||
            !body.residency_file ||
            !body.payment_method) {
            console.log("Missing required params");

            return {
                statusCode: 400,
                result: "Missing parameters"
            };
        }

        if (body.discount === "true" && (!body.discount_file || !body.discount_type)) {
            console.log("Missing discount_file or discount_type");
            return {
                statusCode: 409,
                result: "Missing discount_file or discount_type"
            };
        }

        console.log("init Geolockit service");
        const geolokit = new GeolokitService();
        console.log("Geolockit auth");
        await geolokit.auth();
        console.log("get Geolockit user");
        const client = await geolokit.getUserInformation(body.email);
        console.log("client  = ", client);

        const identityMedia: number[] = [];
        console.log("Save identity media file");
        if (body.identity_file) {
            console.log("Save identity_file");
            body.identity_file.filename = "identity_" + Date.now();
            const id = await geolokit.createMediaParams(body.identity_file, client);
            console.log("Saved : ", id);
            identityMedia.push(id);
        }
        const residencyMedia: number[] = [];
        console.log("Save residency media file");
        if (body.residency_file) {
            console.log("Save residency_file");
            body.residency_file.filename = "residency_" + Date.now();
            const id = await geolokit.createMediaParams(body.residency_file, client);
            console.log("Saved : ", id);
            residencyMedia.push(id);
        }
        const discountMedia: number[] = [];
        console.log("Save discount media file");
        if (body.discount_file) {
            console.log("Save discount_file");
            body.discount_file.filename = "discount_" + Date.now();
            const id = await geolokit.createMediaParams(body.discount_file, client);
            console.log("Saved : ", id);
            discountMedia.push(id);
        }
        const insuranceMedia: number[] = [];
        console.log("Save insurance media file");
        if (body.insurance_file) {
            console.log("Save inssurance_file");
            body.insurance_file.filename = "insurance_" + Date.now();
            const id = await geolokit.createMediaParams(body.insurance_file, client);
            console.log("Saved : ", id);
            insuranceMedia.push(id);
        }

        const [year, month, day] = body.start_date.split("-");
        const duration = Number(body.duration.split(" ")[0]);
        let endMonth = Number(month) + duration;
        let endYear = Number(year);
        if (endMonth > 12) {
            endYear += 1;
            endMonth = ((endMonth - 1) % 12) + 1;
        }
        const dateStart = `${year}-${month}-${day} 00:00:00`;
        const dateEnd = `${endYear}-${DateUtils.padTo2Digits(endMonth)}-${day} 00:00:00`;

        const date = new Date(body.start_date);
        date.setMonth(date.getMonth() + duration);
        const endDate = new Date(date);
        console.log("Start : ", body.start_date);
        console.log("End : ", endDate);
        const bookingStructure = await geolokit.getBookingStructure();
        console.log("bookingStructure = ", bookingStructure);

        const statusField = geolokit.getFieldFromStructure(bookingStructure, "Statut de la reservation");
        console.log("statusField = ", statusField);
        const statusContent = geolokit.getSelectFieldSlug(statusField, "Pré-réservation");
        console.log("statusContent = ", statusContent);
        const paymentField = geolokit.getFieldFromStructure(bookingStructure, "Moyen de paiement");
        console.log("paymentField = ", paymentField);
        const paymentContent = geolokit.getSelectFieldSlug(paymentField, body.payment_method);
        console.log("paymentContent = ", paymentContent);
        const identityTypeField = geolokit.getFieldFromStructure(bookingStructure, "Type de document d'identité");
        console.log("identityTypeField = ", identityTypeField);
        const identityTypeContent = geolokit.getSelectFieldSlug(identityTypeField, body.identity_type);
        console.log("identityTypeContent = ", identityTypeContent);
        const residencyTypeField = geolokit.getFieldFromStructure(bookingStructure, "Type de justificatif de domicile");
        console.log("residencyTypeField = ", residencyTypeField);
        const residencyTypeContent = geolokit.getSelectFieldSlug(residencyTypeField, body.residency_type);
        console.log("residencyTypeContent = ", residencyTypeContent);
        const discountTypeField = geolokit.getFieldFromStructure(bookingStructure, "Type de remise");
        console.log("discountTypeField = ", discountTypeField);
        const discountTypeContent = geolokit.getSelectFieldSlug(discountTypeField, body.discount_type ?? "Aucune remise");
        console.log("discountTypeContent = ", discountTypeContent);

        const clientFirstnameField = client.fields.filter(f => f.title === "Prénom")[0];
        const clientFirstname = clientFirstnameField?.content ?? "Prénom";
        const clientLastNameField = client.fields.filter(f => f.title === "Nom")[0];
        const clientLastName = clientLastNameField?.content ?? "Nom";

        const params: IPoiInput = {
            name: clientFirstname + " " + clientLastName,
            type: "reservation",
            typeId: 4,
            fields: [
                {type: "text", title: "Référence", content: body.reference},
                {type: "text", title: "Type", content: body.type},
                {type: "text", title: "Statut de la reservation", content: statusContent},
                {
                    type: "text",
                    title: "Adresse de livraison",
                    content: `${body.shipping_address}, ${body.shipping_zip_code} ${body.shipping_city}`
                },
                {
                    type: "text",
                    title: "Adresse de récupération",
                    content: `${body.withdrawal_address}, ${body.withdrawal_zip_code} ${body.withdrawal_city}`
                },
                {type: "text", title: "Moyen de paiement", content: paymentContent},
                {type: "text", title: "Type de document d'identité", content: identityTypeContent},
                {type: "text", title: "Type de justificatif de domicile", content: residencyTypeContent},
                {type: "text", title: "Type de remise", content: discountTypeContent},

                {type: "datestart", title: "datestart", content: dateStart},
                {type: "dateend", title: "dateend", content: dateEnd},
                {type: "medias", title: "Document d'identité", content: "[" + identityMedia.join() + "]", pk_id: null},
                {
                    type: "medias",
                    title: "Justificatif de domicile",
                    content: "[" + residencyMedia.join() + "]",
                    pk_id: null
                },
                {
                    type: "medias",
                    title: "Justificatif de remise",
                    content: "[" + discountMedia.join() + "]",
                    pk_id: null
                },
                {
                    type: "medias",
                    title: "Attestation de responsabilité civile",
                    content: "[" + insuranceMedia.join() + "]",
                    pk_id: null
                },
            ]
        };
        console.log("booking : ", params);

        const poiId = await geolokit.create(params);
        console.log("poiId = ", poiId);
        const createdBooking = await geolokit.getPoiById(poiId);
        createdBooking.references = [{
            pk_id: Number(client.pk_id),
            type: String(client.type),
        }];
        await geolokit.update(poiId, createdBooking);

        const clientDocuments = geolokit.getFieldFromStructure(client.fields, "Documents");
        const mediasIds = [...identityMedia, ...residencyMedia, ...discountMedia, ...insuranceMedia];
        if (typeof clientDocuments === "undefined" || clientDocuments === null) {
            client.fields = [
                ...client.fields,
                {type: "medias", title: "Documents", content: "[" + mediasIds.join() + "]", pk_id: null}
            ];
        } else {
            if (typeof clientDocuments.content !== "string" || clientDocuments.content.charAt(clientDocuments.content.length - 1) !== "]") {
                clientDocuments.content = "[" + mediasIds.join() + "]";
            } else {
                clientDocuments.content = clientDocuments.content.substring(0, clientDocuments.content.length - 1) + "," + mediasIds.join() + "]";
            }
        }
        console.log("clientDocuments = ", clientDocuments);
        client.references = [{
            pk_id: createdBooking.pk_id,
            type: createdBooking.type,
        }];
        console.log("client : ", client);
        await geolokit.update(client.pk_id, client);

        console.log("Returning code 201");
        return {
            statusCode: 201
        };
    } catch (error) {
        console.log("[ERROR] body : ", body);
        throw error;
    }
};


