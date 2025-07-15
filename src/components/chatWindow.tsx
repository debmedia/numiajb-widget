import { Send } from "lucide-react";
import { ALLOWED_IMAGE_INPUT_EXTENSIONS, extractMessageFromOutput, getAnimationOrigin, getChatPosition } from "../utils";
import React, { useEffect, useRef, useState } from "react";
import {  ChatWindowProps, file } from "../types";
import ChatMessage from "./message";
import { handleFlowInfo, saveImage, sendMessage } from "../controllers";
import ChatMessagePlaceholder from "./chatPlaceholder";
import ImageUploadBtn from "./imageUploadBtn";
import FilePreview from "./filePreview";
import { ModalImg } from "./modalImg";

export default function ChatWindow({
  api_key,
  flowId,
  hostUrl,
  updateLastMessage,
  messages,
  output_type,
  input_type,
  output_component,
  bot_message_style,
  send_icon_style,
  user_message_style,
  chat_window_style,
  error_message_style,
  placeholder_sending,
  send_button_style,
  online = true,
  open,
  online_message = "¡Hola! Estamos disponibles para ayudarte",
  offline_message = "Actualmente no hay agentes disponibles. Te responderemos pronto",
  window_title = "Chat",
  placeholder,
  input_style,
  input_container_style,
  addMessage,
  position,
  triggerRef,
  width = 450,
  height = 650,
  tweaks,
  sessionId,
  additional_headers,
  attach_img_button_style,
  remove_file_btn_style,
  attach_img_style,
  attached_img_grid_style,
  allow_img_expand,
  attached_img_style,
  attach_file_style,
  img_modal_overlay_style,
  img_modal_img_style,
  files_preview_container_style,
  header_chat_style,
  header_subtitle_style,
  show_chat_status,
  attached_file_style,
  error_send_text_file_style,
  retry_send_file_btn_style,
}: ChatWindowProps) {
  const [value, setValue] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowPosition, setWindowPosition] = useState({ left: "0", top: "0" });
  const inputRef = useRef<HTMLInputElement>(null); 
  const [sendingMessage, setSendingMessage] = useState(false);
  const [ files, setImages ] = useState<Array<file>>([]);
  const [ chatInputIdD, setChatInputID ] = useState<string>("");
  const [ flowName, setFlowName ] = useState<string>("")
  const [modalImg, setModalImg] = useState<File>();
  const [ uploadError, setUploadError ] = useState<string | boolean>(false);

  // Fetch initial flow info 
  useEffect(() => {
    handleFlowInfo(hostUrl, flowId, api_key)
    .then((response) => {
      const { data } = response;
      setFlowName(data.name);
      const chatInput = data.data.nodes?.filter((node: any) => node.id.includes("ChatInput"));
      setChatInputID(chatInput && chatInput[0].id);
    })
    // eslint-disable-next-line
  }, [])

  //Dynamically position chat window based on the trigger element
  useEffect(() => {
    if (triggerRef)
      setWindowPosition(
        getChatPosition(
          triggerRef.current!.getBoundingClientRect(),
          width,
          height,
          position
        )
      );
  }, [triggerRef, width, height, position]);

  // Refocus the User input whenever a new response is returned from the LLM 
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, files]);

  useEffect(() => {
    // after a slight delay
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [messages, open]);

  //  Handle sending a message (text and/or image)
  function handleClick() {
    if (value && value.trim() !== "") {
      if(files && files.length > 0) {
        addMessage({ message: value, isSend: true, files: files });
        setImages([]);

      } else {
        addMessage({ message: value, isSend: true });
      }
      setSendingMessage(true);
      setValue("");
      sendMessage(hostUrl, flowId, value, input_type, output_type, sessionId, output_component, tweaks, api_key, additional_headers, chatInputIdD, files)
        .then((res) => {
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
          if (res.data && res.data.session_id) {
            sessionId.current = res.data.session_id;
          }
          setSendingMessage(false);
        })
        .catch((err) => {
          const response = err.response;
          if (err.code === "ERR_NETWORK") {
            updateLastMessage({
              message: "Network error",
              isSend: false,
              error: true,
            });
          } else if (
            response &&
            response.status === 500 &&
            response.data &&
            response.data.detail
          ) {
            updateLastMessage({
              message: `Lo sentimos, no pudimos generar una respuesta en este momento. Por favor, intentá nuevamente. (Error: ${response.status})`,
              isSend: false,
              error: true,
            });
          }
          console.error(err);
          setSendingMessage(false);
        })
        .finally (() => {
        })
    }
  }

  // Handle file selection
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if(files && files.length > 0) {
      const file = files[0];
      
      handleSaveFile(file);
    }
  }

  //  Upload file and update UI state accordingly
  const handleSaveFile = async (file: File, fileId?: string | undefined) => {
    const id = crypto.randomUUID();
    try {
      const type = file.type.split("/")[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        !fileExtension ||
        !ALLOWED_IMAGE_INPUT_EXTENSIONS.includes(fileExtension)
      ) {
        setUploadError("Formato no soportado. Solo imágenes .jpg/.jpeg/.png");
        setTimeout(() => {
          setUploadError(false);
        }, 3000);
        return;
      }
      setImages(prev => {
        if(fileId) {
            const newPrev = [...prev];
            const idx = prev.findIndex(img => img.id === fileId);
            newPrev[idx].loading = true;
            newPrev[idx].error = false;
            return newPrev
        }
        else {
          return [...prev, { id, file: file, loading: true, error: false, type } ]
        }
      })
      const { file_path } = await saveImage(file, hostUrl, flowId, api_key);
      setImages(prev => {
        const newPrev = [...prev];
        const idx = prev.findIndex(img => img.id === (fileId ?? id));
        newPrev[idx].file_path = file_path;
        newPrev[idx].loading = false;     
        return newPrev
      })
    } catch(err) {
        setImages(prev => {
        const newPrev = [...prev];
        const searchId = fileId ?? id;
        const idx = prev.findIndex(img => img.id === searchId);
        newPrev[idx].loading = false;  
        newPrev[idx].error = true;
        return newPrev
      })
    }
  }

  //  Remove an file by ID
  const onRemoveSelectedFile = (id: string) => {
    setImages(prev => prev.filter((el) => el.id !== id));
  }

  return (
    <>
      <div
        className={
          "cl-chat-window " +
          getAnimationOrigin(position) +
          (open ? " cl-scale-100" : " cl-scale-0")
        }
        style={{ ...windowPosition, zIndex: 9999 }}
      >
        <div
          style={{  ...chat_window_style, width: width, height: height }}
          ref={ref}
          className="cl-window"
        >
          <div style={header_chat_style} className="cl-header">
            {window_title || flowName}
            <div style={header_subtitle_style} className="cl-header-subtitle">
              {show_chat_status && (
                online ? (
                  <>
                    <div className="cl-online-message"></div>
                    {online_message}
                  </>
                ) : (
                  <>
                    <div className="cl-offline-message"></div>
                    {offline_message}
                  </>
                )
              )}
            </div>
          </div>
          <div ref={containerRef} className="cl-messages_container">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.message}
                isSend={message.isSend}
                files={message.files}
                error={message.error}
                attached_img_grid_style={attached_img_grid_style}
                setModalImg={setModalImg}
                allow_img_expand={allow_img_expand}
                attached_img_style={attached_img_style}
                bot_message_style={bot_message_style}
                user_message_style={user_message_style}
                error_message_style={error_message_style}
                attached_file_style={attached_file_style}
              
              />
            ))}
            {sendingMessage && (
              <ChatMessagePlaceholder bot_message_style={bot_message_style} />
            )}
          </div>
          {files.length > 0 && 
            <div style={files_preview_container_style} className="cl-files-container">
              {files.map((file) => (
                <FilePreview
                  error={file.error}
                  file={file.file}
                  loading={file.loading}
                  id={file.id}
                  onDelete={onRemoveSelectedFile}
                  setModalImg={setModalImg}
                  allow_img_expand={allow_img_expand}
                  retrySend={handleSaveFile}
                  attach_img_style={attach_img_style}
                  attach_file_style={attach_file_style}
                  error_send_text_file_style={ error_send_text_file_style}
                  retry_send_file_btn_style={retry_send_file_btn_style}
                />
              ))}
            </div>
          }
          <div style={input_container_style} className="cl-input_container">
            <ImageUploadBtn
              handleImagenChange={handleFileChange}
              attach_img_button_style={attach_img_button_style}
              uploadError={uploadError}
            />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClick();
              }}
              type="text"
              disabled={sendingMessage}
              placeholder={sendingMessage ? (placeholder_sending || "Procesando...") : (placeholder || "Envía un mensaje...")}
              style={input_style}
              ref={inputRef}
              className="cl-input-element"
            />
            <button
              style={send_button_style}
              disabled={(sendingMessage) || (value.length === 0)}
              onClick={handleClick}
              className="cl-button-send-msg"
            >
              <Send
                style={send_icon_style}
              />
            </button>
          </div>
        </div>
      </div>

      {allow_img_expand && modalImg && (
        <ModalImg
          modalImg={modalImg}
          setModalImg={setModalImg}
          remove_file_btn_style={remove_file_btn_style}
          img_modal_overlay_style={img_modal_overlay_style}
          img_modal_img_style={img_modal_img_style}        
        />
      )}
     
    </>
  );
}
