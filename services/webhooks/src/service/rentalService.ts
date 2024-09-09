import {ActivationCodesModel, CitiesModel, RentalOrdersModel, RentalsModel} from "@bikairproject/database";
import {mailBikeRentalTech, mailConfirmBerryRental} from "@bikairproject/mailing";
import {ActivationCodes} from "@bikairproject/shared";
import {DateUtils, generateRandomCode} from "@bikairproject/utils";

export const handleProductRental = async (idVente, product, contact) => {
    console.log("product = ", JSON.stringify(product));

    const dateSplit = product.dateDebut.split("-");
    const year = Number(dateSplit[0]);
    const month = Number(dateSplit[1]);
    const day = Number(dateSplit[2].substring(0, 2));

    console.log("year = ", year);
    console.log("month = ", month);
    console.log("day = ", day);

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
        throw new Error("Invalid date");
    }

    console.log(`Rentals asked for ${day}/${month}/${year}`);
    let startTimeString: string;
    let startTime: number;
    let endTimeString: string;
    let endTime: number;
    let period: string;
    switch (product.idFormule) {
        case 52805:
            startTimeString = DateUtils.localeDateString(year, month, day, 7, 45, 0);
            console.log("Start time string = ", startTimeString);
            startTime = new Date(startTimeString).getTime();
            console.log("Start time = ", startTime);
            endTimeString = DateUtils.localeDateString(year, month, day, 12, 15, 0);
            console.log("End time string = ", endTimeString);
            endTime = new Date(endTimeString).getTime();
            console.log("End time = ", endTime);
            period = "morning";
            break;
        case 52806:
            startTimeString = DateUtils.localeDateString(year, month, day, 13, 45, 0);
            console.log("Start time string = ", startTimeString);
            startTime = new Date(startTimeString).getTime();
            console.log("Start time = ", startTime);
            endTimeString = DateUtils.localeDateString(year, month, day, 18, 15, 0);
            console.log("End time string = ", endTimeString);
            endTime = new Date(endTimeString).getTime();
            console.log("End time = ", endTime);
            period = "afternoon";
            break;
        case 52807:
            startTimeString = DateUtils.localeDateString(year, month, day, 7, 45, 0);
            console.log("Start time string = ", startTimeString);
            startTime = new Date(startTimeString).getTime();
            console.log("Start time = ", startTime);
            endTimeString = DateUtils.localeDateString(year, month, day, 18, 15, 0);
            console.log("End time string = ", endTimeString);
            endTime = new Date(endTimeString).getTime();
            console.log("End time = ", endTime);
            period = "one-day";
            break;
        case 52808:
            startTimeString = DateUtils.localeDateString(year, month, day, 7, 45, 0);
            console.log("Start time string = ", startTimeString);
            startTime = new Date(startTimeString).getTime();
            console.log("Start time = ", startTime);
            endTimeString = DateUtils.localeDateString(year, month, day, 18, 15, 0);
            console.log("End time string = ", endTimeString);
            endTime = new Date(endTimeString).getTime();
            endTime = endTime + (24 * 60 * 60 * 1000); // add one day in milliseconds
            console.log("End time = ", endTime);
            period = "two-day";
            break;
        default:
            console.log("The id formule is unknown : ", product.idFormule);
            console.log("description : ", product.description);
            throw new Error("The id formule is unknown : " + product.idFormule);
    }
    console.log("startTimeString = ", startTimeString);
    console.log("startTime = ", startTime);
    console.log("endTimeString = ", endTimeString);
    console.log("endTime = ", endTime);
    console.log("period = ", period);

    const doublon = await RentalOrdersModel.findOne({
        where: {
            provider_id: idVente,
            start_time: String(startTime),
            end_time: String(endTime),
        }
    });

    if (doublon !== null) {
        console.log("We already created this order.");
        return;
    }

    const {nom, prenom, adresse, codePostal, ville, telephone, email, codePays} = contact;

    const firstname = prenom.trim();
    console.log("firstname = ", firstname);
    const lastname = nom.trim();
    console.log("lastname = ", lastname);
    const phone = telephone.trim();
    console.log("phone = ", phone);
    const mail = email.trim();
    console.log("mail = ", mail);
    const address = adresse.trim() + ", " + codePostal.trim() + " " + ville.trim();
    console.log("address = ", address);
    const locale = codePays === "fr" ? "fr" : "en";
    console.log("locale = ", locale);

    let shipping = false;
    let shippingAddress: string | undefined;
    let withdrawal = false;
    let withdrawalAddress: string | undefined;
    let price = product.prixPaye;
    let priceUnit = product.prixUnitaire;
    if (typeof product.supplements !== "undefined" && product.supplements !== null) {
        for (const sup of product.supplements) {
            if (sup.idOsSupplement === 2350) {
                shipping = true;
                price += sup.prixPaye;
                priceUnit += sup.prixUnitaire;
                if (product.dataFormulaire?.dataProduit?.champs) {
                    console.log("product.dataFormulaire.dataProduit.champs[0] --> ", product.dataFormulaire.dataProduit.champs[0].valeur)
                    console.log("typeof product position 0 --> ", typeof product.dataFormulaire.dataProduit.champs[0].valeur)
                    shippingAddress = appendBourgeAddress(product.dataFormulaire.dataProduit.champs[0].valeur);
                }
            }
            if (sup.idOsSupplement === 2351) {
                withdrawal = true;
                price += sup.prixPaye;
                priceUnit += sup.prixUnitaire;
                if (product.dataFormulaire?.dataProduit?.champs) {
                    console.log("product.dataFormulaire.dataProduit.champs[1] --> ", product.dataFormulaire.dataProduit.champs[1].valeur)
                    console.log("typeof product position 1 --> ", typeof product.dataFormulaire.dataProduit.champs[1].valeur)
                    withdrawalAddress = appendBourgeAddress(product.dataFormulaire.dataProduit.champs[1].valeur);
                }
            }
        }
    }
    console.log("shipping = ", shipping);
    console.log("withdrawal = ", withdrawal);
    console.log("price = ", price);
    console.log("priceUnit = ", priceUnit);

    const bourgeCity = await CitiesModel.findOne({
        where: {
            name: "Bourges"
        }
    });

    if (!bourgeCity) {
        throw new Error("Can't find Bourges in cities table");
    }

    const rentalOrder = await RentalOrdersModel.create({
        provider_id: idVente,
        start_time: String(startTime),
        end_time: String(endTime),
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        email: mail,
        address: address,
        status: "PAYMENT_SUCCESS",
        city_id: bourgeCity.id,
        shipping: shipping,
        shipping_address: shippingAddress,
        withdrawal: withdrawal,
        withdrawal_address: withdrawalAddress,
        nb_bikes: product.quantite,
        type: period,
        locale: locale,
        price: price
    });

    const activationCodes: ActivationCodes[] = [];
    console.log("Creating rentals and activation code.");
    for (let i = 0; i < product.quantite; i++) {
        const rental = await RentalsModel.create({
            rental_order_id: rentalOrder.id,
            start_time: String(startTime),
            end_time: String(endTime),
            customer_email: mail,
            customer_address: address,
            status: "CREATED",
            city_id: bourgeCity.id,
            shipping: shipping,
            withdrawal: withdrawal
        });
        const code = generateRandomCode().toUpperCase();
        const activationCode = await ActivationCodesModel.create({
            code: code,
            email: mail,
            target_id: rental.id,
            type: "RENTAL",
            price: priceUnit
        });
        activationCodes.push(activationCode);
    }

    const codes = activationCodes.map(c => c.code);

    console.log("Code created : ", codes);

    await mailConfirmBerryRental(rentalOrder, codes);
    await mailBikeRentalTech(rentalOrder);

    return rentalOrder;
};


const appendBourgeAddress = (address: string) => {
    console.log("Type of Address -->", address);
    if (!address.toUpperCase().includes("BOURGES") && !address.toUpperCase().includes("13033")) {
        address = address + ", 13033 Bourges";
        console.log("Address -->", address);
    }
    console.log("Return Address -->", address);
    return address;
};

