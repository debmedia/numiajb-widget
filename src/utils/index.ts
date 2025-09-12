import { ChatMessageType } from "../types";

export const supImgFiles = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "image"];
export const ALLOWED_IMAGE_INPUT_EXTENSIONS = ["png", "jpg", "jpeg"];
export const ALLOWED_IMAGE_MIME_TYPES = ["image/png", "image/jpg", "image/jpeg"];
export const fileLimit =  1 * 1024 * 1024;
export const SESSION_ID_STORAGE_KEY = "jb_widget_session_id";
export const SESSION_ID_TTL = 24 * 60 * 60 * 1000; 


export function parseDimensions(value : string) {
  const trimmed = value.trim().toLowerCase();

  if (trimmed.endsWith("vh") || trimmed.endsWith("vw") || trimmed.endsWith("px")) {
    return trimmed;
  }

  const numeric = parseFloat(trimmed);
  if (!isNaN(numeric)) {
    return numeric + "px"; 
  }

  return "400px"; 
}

function parseDimensionToPx(
  value: number | string | undefined,
  axis: "height" | "width"
): number {

  if (!value) return 400;
  if (typeof value === "number") return value;

  const trimmed = value.trim();

  const vhMatch = trimmed.match(/^(\d+(?:\.\d+)?)vh$/);
  if (vhMatch) {
    const vhValue = parseFloat(vhMatch[1]);
    return (vhValue / 100) * window.innerHeight;
  }

  const vwMatch = trimmed.match(/^(\d+(?:\.\d+)?)vw$/);
  if (vwMatch) {
    const vwValue = parseFloat(vwMatch[1]);
    return (vwValue / 100) * window.innerWidth;
  }

  const pxMatch = trimmed.match(/^(\d+(?:\.\d+)?)px$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }

  const rawNumber = parseFloat(trimmed);
  if (!isNaN(rawNumber)) {
    return rawNumber; 
  }

  return 400; 
}


export function getChatPosition(
	triggerPosition: DOMRect,
	Cwidth:string,
	Cheight:string,
	position?: string,
): { top: string; left: string;
	position?: string, } {
	if (!triggerPosition) {
		return { top: "0px", left: "0px" }; // Return empty string if trigger position is not available
	}

	const { width, height } = triggerPosition;

	const w = parseDimensionToPx(Cwidth, "width");
	const h = parseDimensionToPx(Cheight, "height");
	const distance = 5; // Adjust this value to set the desired distance from the trigger
	if(!position) return { top: distance + height+ "px", left: width + "px" };

	switch (position) {
		case "top-left":
			return { top: - distance - h + "px", left: -w + "px" };
		case "top-center":
			return { top: - distance - h + "px", left: width/2-w / 2 + "px" };
		case "top-right":
			return { top: - distance - h + "px", left: width+ "px" };
		case "center-left":
			return { top: width/2-h/2 + "px", left: -w - distance + "px" };
		case "center-right":
			return {
				top: width/2-h/2 + "px",
				left: width + distance + "px",
			};
		case "bottom-right":
			return { top: distance + height+ "px", left: width + "px" };
		case "bottom-center":
			return {
				top: distance + height+ "px",
				left: width/2-w / 2 + "px",
			};
		case "bottom-left":
			return { top: distance + height+ "px", left: -w + "px"};
		default:
			return { top: distance + height+ "px", left: width + "px" };	
		}
}

export function getAnimationOrigin(position?:string) {

	if(!position) return "origin-top-left";
	switch (position) {
		case "top-left":
			return 'origin-bottom-right'
		case "top-center":
			return "origin-bottom";
		case "top-right":
			return "origin-bottom-left";
		case "center-left":
			return "origin-center";
		case "center-right":
			return "origin-center";
		case "bottom-right":
			return "origin-top-left";
		case "bottom-center":
			return "origin-top";
		case "bottom-left":
			return "origin-top-right"
		default:
			return "origin-top-left"
		}
}

export function extractMessageFromOutput(output:{type:string, message:any}){
	const {type, message} = output;
	if(type === "text") return message;
	if (type ==="message") return message.text;
	if(type==="object") return message.text;
	return "Unknown message structure"
}

export default function formatFileName(
  name: string,
  numberToTruncate: number = 25,
): string {
  if (name[numberToTruncate] === undefined) {
    return name;
  }
  const fileExtension = name.split(".").pop(); // Get the file extension
  const baseName = name.slice(0, name.lastIndexOf(".")); // Get the base name without the extension
  if (baseName.length > 6) {
    return `${baseName.slice(0, numberToTruncate)}...${fileExtension}`;
  }
  return name;
}

export function setSessionInLocalStorage(value: string) {
  localStorage.setItem(SESSION_ID_STORAGE_KEY, value);
}

//return the expired session or null
export function getSessionWithExpiry() {
  return (localStorage.getItem(SESSION_ID_STORAGE_KEY) || null);
}

export function removeSession() {
	localStorage.removeItem(SESSION_ID_STORAGE_KEY);
}


export const handleMessageResponse = (res: any, output_component: string | undefined, addMessage: Function) => {
	if (
	  res.data &&
	  res.data.outputs &&
	  Object.keys(res.data.outputs).length > 0 &&
	  res.data.outputs[0].outputs && res.data.outputs[0].outputs.length > 0
	) {
	  const flowOutputs: Array<any> = res.data.outputs[0].outputs;
	  if (output_component &&
		flowOutputs.map(e => e.component_id).includes(output_component)) {
		Object.values(flowOutputs.find(e => e.component_id === output_component).outputs).forEach((output: any) => {
		  addMessage({
			message: extractMessageFromOutput(output),
			isSend: false,
		  });
		})
	  } else if (
		flowOutputs.length === 1
	  ) {
		Object.values(flowOutputs[0].outputs).forEach((output: any) => {
		  addMessage({
			message: extractMessageFromOutput(output),
			isSend: false,
		  });
		})
	  } else {
		flowOutputs
		  .sort((a, b) => {
			// Get the earliest timestamp from each flowOutput's outputs
			const aTimestamp = Math.min(...Object.values(a.outputs).map((output: any) => Date.parse(output.message?.timestamp)));
			const bTimestamp = Math.min(...Object.values(b.outputs).map((output: any) => Date.parse(output.message?.timestamp)));
			return aTimestamp - bTimestamp; // Sort descending (newest first)
		  })
		  .forEach((flowOutput) => {
			Object.values(flowOutput.outputs).forEach((output: any) => {
			  addMessage({
				message: extractMessageFromOutput(output),
				isSend: false,
			  });
			});
		  });
	  }
	}
};

function appendUniqueMessages(
  previousMessages: ChatMessageType[],
  newMessages: ChatMessageType[]
): ChatMessageType[] {

	const existingKeys = new Set(
		previousMessages.map(m => `${m.timestamp}-${m.message}`)
	);

	const filteredNew = newMessages.filter(
		m => !existingKeys.has(`${m.timestamp}-${m.message}`)
	);
	if(filteredNew.length === 0) return [];

	const sortedNew = filteredNew.sort(
		(a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
	);

	return sortedNew;
}

export const handlewebhookMessageResponse = (res: any, addMessage: Function, previousMessages: ChatMessageType[], setSendingMessage: React.Dispatch<React.SetStateAction<boolean>> ) => {
	const newFilteredMessages = appendUniqueMessages(previousMessages,res);

	if(newFilteredMessages.length > 0) {
		setSendingMessage(true);
		setTimeout(() => {
			newFilteredMessages.forEach((message: ChatMessageType) => {
				addMessage({
				message: message.message,
				isSend: false,
				files: message.files,
				timestamp: message.timestamp,
				});
			});

			setSendingMessage(false);
		}, 800);
	}
}