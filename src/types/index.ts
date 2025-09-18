
// Type definitions for journey-builder-chat
export type MainChatWidgetProps = {
  api_key?: string;
  output_type: string,
  input_type: string,
  output_component?: string;
  send_icon_style?: React.CSSProperties;
  chat_position?: string;
  chat_trigger_style?: React.CSSProperties;
  bot_message_style?: React.CSSProperties;
  user_message_style?: React.CSSProperties;
  chat_window_style?: React.CSSProperties;
  online?: boolean;
  online_message?: string;
  offline_message?: string;
  height?: string;
  width?: string;
  window_title?: string;
  error_message_style?: React.CSSProperties;
  send_button_style?: React.CSSProperties;
  placeholder_sending?: string;
  placeholder?: string;
  input_style?: React.CSSProperties;
  input_container_style?: React.CSSProperties;
  host_url: string;
  flow_id: string;
  tweaks?: { [key: string]: any };
  additional_headers?: { [key: string]: string };
  session_id?: string;
  start_open?: boolean;
  attach_img_button_style? :React.CSSProperties;
  remove_file_btn_style?: React.CSSProperties;
  attach_img_style?: React.CSSProperties;
  attached_img_grid_style?: React.CSSProperties;
  allow_img_expand?: boolean;
  attached_img_style?: React.CSSProperties;
  attach_file_style?: React.CSSProperties;
  img_modal_overlay_style?: React.CSSProperties;
  img_modal_img_style?: React.CSSProperties;
  files_preview_container_style?: React.CSSProperties;
  header_chat_style?: React.CSSProperties;
  header_subtitle_style?: React.CSSProperties;
  show_chat_status: boolean;
  attached_file_style?: React.CSSProperties;
  error_send_text_file_style?: React.CSSProperties;
  retry_send_file_btn_style?: React.CSSProperties;
  allow_to_send_imgs: boolean;
  allow_web_hook: boolean;
}

// Props for the ChatWindow component
export type ChatWindowProps = {
  api_key?: string;
  output_type: string,
  input_type: string,
  output_component?: string,
  bot_message_style?: React.CSSProperties;
  send_icon_style?: React.CSSProperties;
  user_message_style?: React.CSSProperties;
  chat_window_style?: React.CSSProperties;
  error_message_style?: React.CSSProperties;
  send_button_style?: React.CSSProperties;
  online?: boolean;
  open: boolean;
  online_message?: string;
  placeholder_sending?: string;
  offline_message?: string;
  window_title?: string;
  placeholder?: string;
  input_style?: React.CSSProperties;
  input_container_style?: React.CSSProperties;
  tweaks?: { [key: string]: any };
  flowId: string;
  hostUrl: string;
  updateLastMessage: Function;
  messages: ChatMessageType[];
  addMessage: Function;
  position?: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  width?: string;
  height?: string;
  sessionId: React.MutableRefObject<string>;
  additional_headers?: { [key: string]: string };
  attach_img_button_style? :React.CSSProperties;
  remove_file_btn_style?: React.CSSProperties;
  attach_img_style?: React.CSSProperties;
  attached_img_grid_style?: React.CSSProperties;
  allow_img_expand: boolean;
  attached_img_style?: React.CSSProperties;
  attach_file_style?: React.CSSProperties;
  img_modal_overlay_style?: React.CSSProperties;
  img_modal_img_style?: React.CSSProperties;
  files_preview_container_style?: React.CSSProperties;
  header_chat_style?: React.CSSProperties;
  header_subtitle_style?: React.CSSProperties;
  show_chat_status: boolean;
  attached_file_style?: React.CSSProperties;
  error_send_text_file_style?: React.CSSProperties;
  retry_send_file_btn_style?: React.CSSProperties;
  allow_to_send_imgs: boolean;
  allow_web_hook: boolean;
}

// Type for the ChatMessage 
export type ChatMessageType = {
  message: string;
  isSend: boolean;
  error?: boolean;
  files?: Array<file>,
  bot_message_style?: React.CSSProperties;
  user_message_style?: React.CSSProperties;
  error_message_style?: React.CSSProperties;
  attached_img_grid_style?: React.CSSProperties;
  setModalImg: React.Dispatch<React.SetStateAction<File | undefined>>,
  allow_img_expand: boolean,
  attached_img_style?: React.CSSProperties;
  attached_file_style?: React.CSSProperties,
  timestamp?: string,
  sender?:string,
  text?: string
};

// Props for the FilePreview component
export type FilePreviewProps = {
  loading: boolean;
  file: File;
  id: string,
  error: boolean;
  onDelete: (id:string) => void;
  remove_file_btn_style?: React.CSSProperties;
  attach_img_style?: React.CSSProperties;
  setModalImg: React.Dispatch<React.SetStateAction<File | undefined>>;
  allow_img_expand: boolean;
  retrySend:(file: File, fileId: string) => void;
  skeleton_file_style?: React.CSSProperties;
  attach_file_style?: React.CSSProperties;
  error_send_text_file_style?: React.CSSProperties;
  retry_send_file_btn_style?: React.CSSProperties;
};

// Props for the ChatMessagePlaceholder component
export type ChatMessagePlaceholderType = {
  bot_message_style?: React.CSSProperties;
};

// Type for file with additional properties
export type file = { 
  file:File, 
  file_path?: string, 
  loading:boolean, 
  id: string, 
  error: boolean, 
  type: string 
};

export type WebhookeMessage = {
  message: string,
  sender: string,
  timestamp: string,
}

export type WebhookResponse = {
  messages: WebhookeMessage[]
}

export type WebhookDataToSend = {
  session_id: string,
  message: string,
  origen: string,
  stream: boolean
}