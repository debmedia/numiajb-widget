export function extractMessageFromOutput(output:{type:string, message:any}){
    const {type, message} = output;
    if(type === "text") return message;
    if (type ==="message") return message.text;
    if(type==="object") return message.text;
    return "Unknown message structure"
}
// Handles the response from sending a message to the chatbot
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
