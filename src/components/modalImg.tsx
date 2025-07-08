import { X } from "lucide-react";
import { Imagen } from "./imagen"
import React, { useEffect } from "react";

export function ModalImg({
    setModalImg,
    modalImg,
    remove_file_btn_style,
    img_modal_overlay_style,
    img_modal_img_style
}:{
    setModalImg: React.Dispatch<React.SetStateAction<File | undefined>>,
    modalImg:File;
    remove_file_btn_style?: React.CSSProperties;
    img_modal_overlay_style?: React.CSSProperties;
    img_modal_img_style?: React.CSSProperties;
}) {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setModalImg(undefined);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
        
  }, [setModalImg]);

    return (
        <div
            style={img_modal_overlay_style}
            className="image-modal-overlay"
            onClick={() => setModalImg(undefined)}
        >
            <button 
                style={remove_file_btn_style} 
                className="cl-remove-imgs-btn cl-close-imgs-modal" 
                onClick={() => setModalImg(undefined)}>
                    <X size={12}/>
            </button>
            <Imagen
                style={img_modal_img_style}
                file={modalImg}
                className="image-modal-content"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )
}