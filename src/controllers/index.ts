import axios from "axios";
import { file, WebhookDataToSend } from "../types";

export async function handleFlowInfo(baseUrl: string, flowId: string, api_key?:string) {
    let headers:{[key:string]:string}= {"Content-Type": "application/json"}
    if( api_key){
        headers["x-api-key"]=api_key;
    } 
    let response = await axios.get(`${baseUrl}/api/v1/flows/${flowId}`, {headers});
    return response.data;
}

export async function handlewebhook(baseUrl: string, flowId: string, message: string,input_type:string,output_type:string,sessionId:React.RefObject<string>,output_component?:string, tweaks?: Object,api_key?:string,additional_headers?:{[key:string]:string}, chatInputID?:string, files?: Array<file>
) {
    try {
        let data: WebhookDataToSend = {
            session_id: sessionId.current || "",
            message: message,
            origen: "widget",
            stream: false
        };

        let headers: { [key: string]: string } = { "Content-Type": "application/json" };
        if (api_key) {
            headers["x-api-key"] = api_key;
        }

        return await axios.post(`${baseUrl}/api/v1/webhook/${flowId}`, data, { headers });
    } catch (error) {
        console.error("Error in handlewebhook:", error);
        throw error;
    }
    
}

export async function sendMessage(baseUrl: string, flowId: string, message: string,input_type:string,output_type:string,sessionId:React.RefObject<string>,output_component?:string, tweaks?: Object,api_key?:string,additional_headers?:{[key:string]:string}, chatInputID?:string, files?: Array<file>) {
    let data:any;
    data = {input_type, output_type}
    
    const allFiles = files?.filter(file => !file.error);
    if(allFiles && allFiles.length > 0 && chatInputID) {
        data["tweaks"] =  {
                ...(tweaks || {}),
                [chatInputID] : {
                files: allFiles[0]?.file_path,
                input_value: message,
            }
        }
    } else if(chatInputID) {
        data["tweaks"] = {
            ...(tweaks || {}),
            [chatInputID] : {
                input_value: message,
            }
        }
    }
    
    if(output_component) {
        data["output_component"] = output_component;
    }

    let headers: { [ key:string ] : string }= { "Content-Type": "application/json" };
    if(api_key){
        headers["x-api-key"] = api_key;
    }
    if (additional_headers){
        headers = Object.assign(headers, additional_headers);
    }
    if(sessionId.current && sessionId.current !== ""){
        data.session_id = sessionId.current;
    }
    return axios.post(`${baseUrl}/api/v1/run/${flowId}`, data,{headers});
    
}

export async function saveImage(file: File, baseUrl: string, flowId: string, api_key?:string ) {
    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {};

    if (api_key) {
        headers["x-api-key"] = api_key;
    }

    const response = await fetch(`${baseUrl}/api/v1/files/upload/${flowId}`, {
        method: "POST",
        headers, 
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Error en la subida: ${response.statusText}`);
    }

    return response.json();
}

export async function pollingMessages(baseUrl: string, flowId: string, sessionId:React.RefObject<string>, api_key?:string, additional_headers?:{[key:string]:string}) {

    let headers: { [key: string]: string } = { "Content-Type": "application/json" };
    if (api_key) {
        headers["x-api-key"] = api_key;
    }

    if (additional_headers){
        headers = Object.assign(headers, additional_headers);
    }
    return axios.get(`${baseUrl}/api/v1/flows/${flowId}/last_messages?session_id=${sessionId.current}&limit=2`, {headers});
}


export async function getVonageInfo(baseUrl: string, sessionId:React.RefObject<string>, api_key?:string, additional_headers?:{[key:string]:string}) {

    let headers: { [key: string]: string } = { "Content-Type": "application/json" };
    if (api_key) {
        headers["x-api-key"] = api_key;
    }
    
    if (additional_headers){
        headers = Object.assign(headers, additional_headers);
    }
    
    return axios.get(`${baseUrl}/api/v1/redis/${sessionId.current}`, {headers});
}