import axios from "axios";
import { file } from "../types";

export async function handleFlowInfo(baseUrl: string, flowId: string, api_key?:string) {
    let headers:{[key:string]:string}= {"Content-Type": "application/json"}
    if( api_key){
        headers["x-api-key"]=api_key;
    } 
    let response = axios.get(`${baseUrl}/api/v1/flows/${flowId}`, {headers});
    return response;
}

export async function sendMessage(baseUrl: string, flowId: string, message: string,input_type:string,output_type:string,sessionId:React.MutableRefObject<string>,output_component?:string, tweaks?: Object,api_key?:string,additional_headers?:{[key:string]:string}, chatInputID?:string, files?: Array<file>) {
    let data:any;
    data = {input_type,input_value:message,output_type}
    if(files && files.length > 0 && chatInputID) {
        data["tweaks"] =  {
                ...(tweaks || {}),
                [chatInputID] : {
                files: files?.map(img => img.file_path),
                session_id: sessionId.current
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
    let response = axios.post(`${baseUrl}/api/v1/run/${flowId}`, data,{headers});
    return response;
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