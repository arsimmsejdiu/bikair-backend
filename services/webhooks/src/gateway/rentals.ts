import express from "express";
import fetch from "node-fetch";

import {handleProductRental} from "../service/rentalService";

const router = express.Router();

router.get("/berry-tourisme", async (req, res) => {
    if (!req.query) {
        console.log("No query for the request. Skipping...");
        return res.status(400).send("Format invalide").end();
    }
    console.log("Query : ", req.query);
    const idVente = req.query.idVente;

    const url = `https://api-billet.open-system.fr/v1/stock.svc/resas/${idVente}`;
    const options = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Basic YmlrYWlyOjhKOWJrZVRVNDJ1N0Z3"
        },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        return res.status(400).send("Can't get product info").end();
    }

    const json = await response.json();

    console.log("json = ", json);

    const {contact, produits} = json.data;

    console.log("contact = ", contact);
    console.log("produits = ", produits);

    for (const product of produits) {
        await handleProductRental(idVente, product, contact);
    }

    return res.status(200).send("Ok").end();
});

export default router;