export const supImgFiles = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "image"];
export const ALLOWED_IMAGE_INPUT_EXTENSIONS = ["png", "jpg", "jpeg"];

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

	console.log(Cheight, Cwidth);
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
