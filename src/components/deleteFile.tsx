import { X } from "lucide-react";
import React from "react"

export default function DeleteFile({
        remove_file_btn_style,
        onClick,
    }:{
        remove_file_btn_style?: React.CSSProperties;
        onClick: () => void;
    }) {


    return (
         <button 
            style={remove_file_btn_style} 
            className="cl-remove-imgs-btn" 
            onClick={onClick}
        >
            <X size={12}/>
        </button>
    )
}