import axios from "axios";
import { file } from "../types";

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
        let data:any = {};
        
        let headers: { [key: string]: string } = { "Content-Type": "application/json" };
        // headers["ngrok-skip-browser-warning"] = "true";
        if (api_key) {
            headers["x-api-key"] = api_key;
        }
        
        data["session_id"] =  sessionId.current || "";
        data.message =  message;
        data.origen = "widget"
        data.stream = false
        
        let response = await axios.post(`${baseUrl}/api/v1/webhook/${flowId}`, data, { headers });
        return response;
    } catch (error) {
        console.error("Error in handlewebhook:", error);
        throw error;
    }
    
}

export async function sendMessage(baseUrl: string, flowId: string, message: string,input_type:string,output_type:string,sessionId:React.RefObject<string>,output_component?:string, tweaks?: Object,api_key?:string,additional_headers?:{[key:string]:string}, chatInputID?:string, files?: Array<file>) {
    let data:any;
    data = {input_type,input_value:message,output_type}
    const allFiles = files?.filter(file => !file.error);
    if(allFiles && allFiles.length > 0 && chatInputID) {
        data["tweaks"] =  {
                ...(tweaks || {}),
                [chatInputID] : {
                files: allFiles?.map(img => img.file_path),
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

export async function sendMessageAdvanced(baseUrl: string, flowId: string, message: string,input_type:string,output_type:string,sessionId:React.RefObject<string>,output_component?:string, tweaks?: Object,api_key?:string,additional_headers?:{[key:string]:string}, chatInputID?:string, files?: Array<file>, flowInfo?: any) {
    let data: any = {
        inputs: [
            {
                components: [input_type],
                input_value: message
            }
        ],
        outputs: [output_type],
        tweaks: {},
        stream: false
    };

    // If we have flow info, use the actual ChatInput and ChatOutput component IDs
    if (flowInfo?.data?.nodes) {
        // Find ChatInput node
        const chatInputNode = flowInfo.data.nodes.find((node: any) => {
            const isChatInput = node.data?.node?.template?.name === "ChatInput" || 
                               node.data?.type === "ChatInput" ||
                               node.type === "ChatInput";
            return isChatInput;
        });
        
        // Find ChatOutput node
        const chatOutputNode = flowInfo.data.nodes.find((node: any) => {
            const isChatOutput = node.data?.node?.template?.name === "ChatOutput" || 
                                node.data?.type === "ChatOutput" ||
                                node.type === "ChatOutput";
            return isChatOutput;
        });
        
        if (chatInputNode) {
            data.inputs[0].components = [chatInputNode.id];
        }
        
        if (chatOutputNode) {
            data.outputs = [chatOutputNode.id];
        }
    }

    // Add output component if specified
    if(output_component) {
        data.outputs.push(output_component);
    }

    // Handle files and session ID in tweaks
    const allFiles = files?.filter(file => !file.error);
    if(allFiles && allFiles.length > 0 && chatInputID) {
        data.tweaks[chatInputID] = {
            files: allFiles?.map(img => img.file_path),
            session_id: sessionId.current
        };
    }

    // Add custom tweaks if provided
    if(tweaks) {
        data.tweaks = { ...data.tweaks, ...tweaks };
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
    
    let response = axios.post(`${baseUrl}/api/v1/run/advanced/${flowId}`, data,{headers});
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

export async function pollingMessages(baseUrl: string, flowId: string, sessionId:React.RefObject<string>, api_key?:string, additional_headers?:{[key:string]:string}) {

    let headers: { [key: string]: string } = { "Content-Type": "application/json" };
    if (api_key) {
        headers["x-api-key"] = api_key;
    }

    if (additional_headers){
        headers = Object.assign(headers, additional_headers);
    }
    let response = axios.get(`${baseUrl}/api/v1/flows/${flowId}/last_messages?session_id=${sessionId.current}&limit=2`, {headers});
    return response;

}
