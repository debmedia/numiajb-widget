import { X } from "lucide-react";
import React from "react"

export default function DeleteFile({
        style,
        onClick,
    }:{
        style?: React.CSSProperties;
        onClick: () => void;
    }) {


    return (
         <button 
            style={style} 
            className="cl-remove-imgs-btn" 
            onClick={onClick}
        >
            <X size={12}/>
        </button>
    )
}