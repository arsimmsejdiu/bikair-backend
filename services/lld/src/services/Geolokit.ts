import axios from "axios";

import {GEOLOKIT_BASE_URL, GEOLOKIT_MAIL, GEOLOKIT_PW} from "../config/config";
import {IMediaInput, IPoiInput} from "../lib/IGeolokit";
import {LldFile} from "@bikairproject/shared/dist/dto/LldFile";


class GeolokitService {
    private base_url: string = GEOLOKIT_BASE_URL;
    private usermail: string = GEOLOKIT_MAIL;
    private userpw: string = GEOLOKIT_PW;

    private token: string;
    private current_workspace_id: number;
    private auth_lastname: string;
    private auth_firstname: string;

    public async auth() {
        try {
            const {data} = await axios.get(GEOLOKIT_BASE_URL + "account", {
                headers: {
                    "User-Mail": this.usermail,
                    "User-Pass": this.userpw
                }
            });
            this.token = data.token;
            this.current_workspace_id = data.current_workspace_id;
            this.auth_lastname = data.lastname;
            this.auth_firstname = data.firstname;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    private async uploadMedia(params: IMediaInput) {
        try {
            const {data} = await axios.post(this.base_url + "medias",
                JSON.stringify(params),
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getUserInformation(email: string) {
        try {
            const url = this.base_url + "poi?type=client&field::email::value=" + encodeURI(email);
            console.log("GET: ", url);
            const result = await axios.get(url,
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });
            if (result.data.count === 0) {
                return null;
            }
            return result.data.pois[0];
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    public async getPoiById(id: string | number) {
        try {
            const url = this.base_url + "poi/" + id;
            console.log("GET: ", url);
            const result = await axios.get(url,
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });
            if (typeof result.data === "undefined" || result.data === null) {
                return null;
            }
            return result.data;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    public async getClientStructure() {
        try {
            const result = await axios.get(this.base_url + "structurepoi/1",
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });

            return result.data.fields;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    public async getBookingStructure() {
        try {
            const result = await axios.get(this.base_url + "structurepoi/4",
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });

            return result.data.fields;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    public async getRepairStructure() {
        try {
            const result = await axios.get(this.base_url + "structurepoi/5",
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });

            return result.data.fields;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    public getFieldFromStructure(structure: any[], fieldName: string) {
        for (const field of structure) {
            if (field.title === fieldName) {
                return field;
            }
        }
        return null;
    }

    public getSelectFieldSlug(field: any, title: string) {
        for (const option of field.options) {
            if (option.title === title) {
                return option.slug;
            }
        }
        return null;
    }

    public getClientFieldValue = (client: any, title: string) => {
        for (const field of client.fields) {
            if (field.title === title) {
                return field.content;
            }
        }
        return null;
    };

    public async createMediaParams(file: LldFile, client: any) {
        try {

            const dateString = new Date().toString();
            const params: IMediaInput = {
                pk_id: null,
                name: file.filename,
                extension: file.content_type.split("/").pop() ?? "jpg",
                content: file.content,
                mime: file.content_type,
                accessibility: "public",
                date: dateString,
                user_firstname: this.getClientFieldValue(client, "Nom"),
                user_lastname: this.getClientFieldValue(client, "Prénom"),
            };

            return await this.uploadMedia(params);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async create(params: IPoiInput) {
        try {
            console.log("Send create request request to Geolockit");
            const response = await axios.post(this.base_url + "poi",
                JSON.stringify(params),
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });
            console.log("Done.");
            return response.data;
        } catch (error: any) {
            console.log("[error]", error.response.data);
            throw error;
        }
    }

    public async update(poiId: number, params: IPoiInput) {
        try {
            console.log("Send update request request to Geolockit for poi ", poiId);
            await axios.put(this.base_url + "poi/" + poiId,
                JSON.stringify(params),
                {
                    headers: {
                        "Current-Workspace-Id": this.current_workspace_id,
                        "User-Mail": this.usermail,
                        "User-Token": this.token
                    }
                });
            console.log("Done.");
        } catch (error: any) {
            console.log("[error]", error.response.data);
            throw error;
        }
    }
}


export default GeolokitService;
