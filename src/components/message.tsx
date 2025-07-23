import Markdown from "react-markdown";
import { ChatMessageType } from "../types";
import rehypeMathjax from "rehype-mathjax";
import { supImgFiles } from "../utils";
import { FileComponent } from "./fileComponent";
import { Imagen } from "./imagen";

export default function ChatMessage({
  message,
  isSend,
  error,
  user_message_style,
  bot_message_style,
  error_message_style,
  files,
  attached_img_grid_style,
  setModalImg,
  allow_img_expand,
  attached_img_style,
  attached_file_style
}: ChatMessageType) {
  const getGridClass = (count: number) => {
    if (count === 1) return 'one';
    if (count === 2) return 'two';
    if (count === 3) return 'three';
    if (count === 4) return 'four';
    return 'more';
  };

  return (
    <div
      className={"cl-chat-message" + (isSend ? " cl-justify-end" : "cl-justify-start")}
    >
      {isSend ? (
        <div style={{
            width:"100%",
            display:"flex",
            flexDirection:"column",
            justifyContent:"flex-end",
            alignContent:"flex-end"
          }}
        >
          
          <div style={user_message_style} className="cl-message cl-user_message ">
            {message}
            {files && files.length > 0 && 
              <div style={attached_img_grid_style} className={`chat-files-grid ${getGridClass(files.length)}`}>
                {files.map((file, i) => {
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
      ) : error ? (
        <div style={error_message_style} className={"cl-message cl-error_message"}>
          <Markdown 
            className={"markdown-body prose flex flex-col word-break-break-word"}
            rehypePlugins={[rehypeMathjax]}
          >
            {message}
          </Markdown>
        </div>
      ) : (
        <div style={bot_message_style} className={"cl-message cl-bot_message"}>
          <Markdown 
            className={"markdown-body prose flex flex-col word-break-break-word"}
            rehypePlugins={[rehypeMathjax]}
            components={{
              p: ({ children }) => (
                <p style={{ whiteSpace: 'pre-wrap' }}>{children}</p>
              ),
            }}
          >
            {message}
          </Markdown>
        </div>
      )}
    </div>
  );
}

