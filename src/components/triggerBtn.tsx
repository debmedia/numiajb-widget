import { MessageSquare, X } from "lucide-react"
import React from "react"
export default function ChatTrigger({ style, open, setOpen, triggerRef }: { style?: React.CSSProperties, open: boolean, setOpen: Function, triggerRef: React.RefObject<HTMLButtonElement| null> | null }) {

    return (
        <button 
            ref={triggerRef} 
            style={style}
            onClick={() => { setOpen(!open) }}
            onMouseDown={(e) => {
                e.preventDefault()
            }}
            className="cl-trigger"
        >
            <X className={"cl-trigger-icon " + (open ? "cl-scale-100" : "cl-scale-0")} />
            <MessageSquare className={"cl-trigger-icon " + (open ? "cl-scale-0" : "cl-scale-100")} />
        </button>
    )
}