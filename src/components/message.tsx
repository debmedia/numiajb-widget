import Markdown from "react-markdown";
import { ChatMessageProps, MessageStatus } from "../types";
import rehypeMathjax from "rehype-mathjax";
import { FileComponent } from "./fileComponent";
import { Imagen } from "./imagen";
import { supImgFiles } from "../constants";
import { CheckCheck, CircleAlert, Clock } from "lucide-react";

export default function ChatMessage({
  message,
  user_message_style,
  bot_message_style,
  error_message_style,
  attached_img_grid_style,
  setModalImg,
  allow_img_expand,
  attached_img_style,
  attached_file_style
}: ChatMessageProps) {

  const getGridClass = (count: number) => {
    if (count === 1) return 'one';
    if (count === 2) return 'two';
    if (count === 3) return 'three';
    if (count === 4) return 'four';
    return 'more';
  };

  function formatMessageWithLinks(text: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `[${url}](${url})`; // markdown link
    });
  }

  function convertTo12HourFormat(dateString: string | undefined): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toUTCString().slice(17, 22);
  }

  return (
    <div
      className={"cl-chat-message" + (message.isSend ? " cl-justify-end" : "cl-justify-start")}
    >
      {message.isSend ? (
        <div style={{
            width:"100%",
            display:"flex",
            flexDirection:"column",
            justifyContent:"flex-end",
            alignContent:"flex-end"
          }}
        >
          
          <div style={{...user_message_style, position:"relative"}} className="cl-message cl-user_message font-patched-md">
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "center",
              }} 
            >
              <p 
                style={{
                  flexBasis: "10/12",
                  margin: "0px",
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {message.message}
              </p> 
              <div 
                style={{
                  flexBasis: "2/12",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "3px",
                  alignItems: "flex-end",
                  height: "100%",
                }} 
              >
                <p className="cl-message-timestamp">
                  {convertTo12HourFormat(message.timestamp)}
                </p>
                {message.status === MessageStatus.SENT ?
                  <CheckCheck size={15} color="#a2a5a8"/>
                  :
                  message.status === MessageStatus.WARNING ?
                  <CircleAlert size={15} color="#a2a5a8"/>
                  :
                  message.status === MessageStatus.PENDING ?
                  <Clock size={15} color="#a2a5a8"/>
                  :
                  null
                }
              </div>
            </div>
            {message.files && message.files.length > 0 && 
              <div style={attached_img_grid_style} className={`chat-files-grid ${getGridClass(message.files.length)}`}>
                {message.files.map((file, i) => {
                  const fileType = file.type.toLowerCase();
                  const isImage = supImgFiles.some((type) => fileType.includes(type));
                  if(isImage) { 
                    return (
                      <Imagen
                        file={file.file}
                        style={attached_img_style}
                        className={allow_img_expand ? "clickeable" : ""}
                        onClick={() => allow_img_expand && setModalImg(file.file)} 
                      />
                    ) 
                  } else {
                    return (
                      <FileComponent
                        style={attached_file_style}
                        name={file.file.name}
                      />
                  )}
                })}
              </div>
            }
          </div>
        </div>
      ) : message.error ? (
        <div style={error_message_style} className={"cl-message cl-error_message"}>
          <Markdown
            className={"markdown-body prose flex flex-col word-break-break-word font-patched-md"}
            rehypePlugins={[rehypeMathjax]}
          >
            {message.message}
          </Markdown>
        </div>
      ) : (
        <div 
          style={{
            ...bot_message_style,
            display: "flex",
            flexWrap: "nowrap",
          }} 
          className={"cl-message cl-bot_message"}
          
        >
          <Markdown 
            className={"basis-10/12 markdown-body prose flex flex-col word-break-break-word font-patched-md"}
            rehypePlugins={[rehypeMathjax]}
            components={{
              a: ({ href, children }: any) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  {children}
                </a>
              ),
              p: ({ children }) => (
                <p style={{ whiteSpace: 'pre-wrap' }}>{children}</p>
              ),
            }}
          >
            {formatMessageWithLinks(message.message)}
          </Markdown>

          <p className="cl-message-timestamp">
            {convertTo12HourFormat(message.timestamp)}
          </p>

        </div>
      )}
    </div>
  );
}

