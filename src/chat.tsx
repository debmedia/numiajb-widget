import { useRef, useState } from "react";
import ChatTrigger from "./components/triggerBtn";
import ChatWindow from "./components/chatWindow";
import { ChatMessageType, MainChatWidgetProps } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { markdownBody, styles } from "./styles";

export default function ChatWidget({
  api_key,
  output_type = "chat",
  input_type = "chat",
  output_component,
  chat_trigger_style,
  host_url,
  flow_id,
  tweaks,
  send_icon_style,
  bot_message_style,
  user_message_style,
  chat_window_style,
  height,
  width,
  error_message_style,
  send_button_style,
  online,
  online_message,
  offline_message,
  window_title,
  chat_position,
  placeholder,
  input_style,
  placeholder_sending,
  input_container_style,
  additional_headers,
  session_id,
  start_open=false,
  remove_file_btn_style,
  attach_img_style,
  attached_img_grid_style,
  allow_img_expand = true,
  attached_img_style,
  attach_file_style,
  img_modal_overlay_style,
  img_modal_img_style,
  attach_img_button_style,
  files_preview_container_style,
  header_chat_style,
  header_subtitle_style,
  show_chat_status = true,
  attached_file_style,
  allow_to_send_imgs = true
}: MainChatWidgetProps ) {

  const [open, setOpen] = useState(start_open);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const sessionId = useRef(session_id ?? uuidv4());
  const triggerRef = useRef<HTMLButtonElement>(null);

  function updateLastMessage(message: ChatMessageType) {
    setMessages((prev) => {
      const p = [...prev];
      p.push(message);
      return p;
    });
  }

  function addMessage(message: ChatMessageType) {
    setMessages((prev) => [...prev, message]);
  }

  return (
    <div style={{ position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: styles + markdownBody }}></style>
      <ChatTrigger
        triggerRef={triggerRef}
        open={open}
        setOpen={setOpen}
        style={chat_trigger_style}
      />
      <ChatWindow
        api_key={api_key}
        input_type={input_type}
        output_type={output_type}
        output_component={output_component}
        open={open}
        height={height}
        width={width}
        send_icon_style={send_icon_style}
        bot_message_style={bot_message_style}
        user_message_style={user_message_style}
        chat_window_style={chat_window_style}
        error_message_style={error_message_style}
        send_button_style={send_button_style}
        placeholder={placeholder}
        input_style={input_style}
        online={online}
        online_message={online_message}
        offline_message={offline_message}
        placeholder_sending={placeholder_sending}
        window_title={window_title}
        input_container_style={input_container_style}
        tweaks={tweaks}
        flowId={flow_id}
        hostUrl={host_url}
        updateLastMessage={updateLastMessage}
        addMessage={addMessage}
        messages={messages}
        triggerRef={triggerRef}
        position={chat_position}
        sessionId={sessionId}
        additional_headers={additional_headers}
        remove_file_btn_style={remove_file_btn_style}
        attach_img_style={attach_img_style}
        attached_img_grid_style={attached_img_grid_style}
        allow_img_expand={allow_img_expand}
        attached_img_style={attached_img_style}
        attach_file_style={attach_file_style}
        img_modal_overlay_style={img_modal_overlay_style}
        img_modal_img_style={img_modal_img_style}
        attach_img_button_style={attach_img_button_style}
        files_preview_container_style={files_preview_container_style}
        header_chat_style={header_chat_style}
        header_subtitle_style={header_subtitle_style}
        show_chat_status={show_chat_status}
        attached_file_style={attached_file_style}
        allow_to_send_imgs={allow_to_send_imgs}
      />
    </div>
  );
}
