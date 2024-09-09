import { APIGatewayEvent } from "aws-lambda";
import { parse } from "aws-multipart-parser";
import { Context } from "vm";

import { createSpot } from "../services/createSpot";
import { PostCreateSpotsInput } from "@bikairproject/lib-manager";

export const handler = async (event: APIGatewayEvent, context: Context) => {
    console.log("Begin");
    console.log("Parse form data");
    const formData = parse(event, true);
    console.log("Get file content");
    const content = formData.file?.content ?? null;
    if(!content){
        console.log("No file content");
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: "No content csv found"
        };
    }
    console.log("Read buffer");
    const buffer = Buffer.from(content);
    const stringCsv = buffer.toString();
    const splitedCsv = stringCsv.split("\n");

    console.log("Getting indexes");
    const headerSplit = splitedCsv[0].replace(/\r?\n|\r/g, "").split(",");
    console.log("headerSplit = ", headerSplit);
    const name_index = headerSplit.indexOf("name");
    console.log("name_index = ", name_index);
    const address_index = headerSplit.indexOf("address");
    console.log("address_index = ", address_index);
    const city_name_index = headerSplit.indexOf("city_name");
    console.log("city_name_index = ", city_name_index);
    const city_id_index = headerSplit.indexOf("city_id");
    console.log("city_id_index = ", city_id_index);
    const latitude_index = headerSplit.indexOf("latitude");
    console.log("latitude_index = ", latitude_index);
    const longitude_index = headerSplit.indexOf("longitude");
    console.log("longitude_index = ", longitude_index);
    const max_bikes_index = headerSplit.indexOf("max_bikes");
    console.log("max_bikes_index = ", max_bikes_index);
    const status_index = headerSplit.indexOf("status");
    console.log("status_index = ", status_index);
    const app_client_index = headerSplit.indexOf("app_client");
    console.log("app_client_index = ", app_client_index);
    const app_tech_index = headerSplit.indexOf("app_tech");
    console.log("app_tech_index = ", app_tech_index);

    console.log("Begin for loop");
    for (let i = 1; i < splitedCsv.length; i++) {
        const splited = splitedCsv[i].replace(/\r?\n|\r/g, "").split(",");
        const tmp: Partial<PostCreateSpotsInput> = {
            name: name_index >= 0 ? splited[name_index] : undefined,
            city_name: city_name_index >= 0 ? splited[city_name_index] : undefined,
            latitude: latitude_index >= 0 ? splited[latitude_index] : undefined,
            longitude: longitude_index >= 0 ? splited[longitude_index] : undefined,
            max_bikes: max_bikes_index >= 0 ? Number(splited[max_bikes_index]) : undefined,
            address: address_index >= 0 ? splited[address_index] : undefined,
            city_id: city_id_index >= 0 ? Number(splited[city_id_index]) : undefined,
            status: status_index >= 0 ? splited[status_index] : undefined,
            app_client: app_client_index >= 0 ? Boolean(splited[app_client_index]) : undefined,
            app_tech: app_tech_index >= 0 ? Boolean(splited[app_tech_index]) : undefined
        };
        console.log("tmp = ", tmp);
        if((tmp.city_name || tmp.city_id) && tmp.latitude && tmp.longitude){
            await createSpot(tmp);
        } else {
            console.log("Missing core value. Can't save");
        }
    }

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        body: "Ok"
    };
};
