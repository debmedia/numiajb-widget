import { MoreHorizontal } from "lucide-react";
import { ChatMessagePlaceholderType } from "../types";

export default function ChatMessagePlaceholder({
  bot_message_style,
}: ChatMessagePlaceholderType) {
  return (
    <div className="cl-justify-start w-min">
        <div style={bot_message_style} className={"cl-message cl-bot_message"}>
            <div className="cl-animate-pulse">
              <MoreHorizontal />
            </div>
        </div>
    </div>
  );
}
