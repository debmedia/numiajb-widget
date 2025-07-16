import React from "react";
import { Image } from 'lucide-react';

export default function ImageUploadBtn (
    { 
        handleImagenChange,
        attach_img_button_style,
        uploadError,
        allow_to_send_imgs,
        disabled
    } : {
        handleImagenChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
        attach_img_button_style? : React.CSSProperties;
        uploadError: boolean | string;
        allow_to_send_imgs: boolean;
        disabled: boolean
    }
)  {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const onChange = async(e:React.ChangeEvent<HTMLInputElement>) => {
        await handleImagenChange(e); 
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
    }
    
    return (
        allow_to_send_imgs && 
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onChange}
            />
            <div className={"tooltip-wrapper"}>
                <button
                    type="button"
                    className="cl-send-image-btn"
                    onClick={handleButtonClick}
                    style={attach_img_button_style}
                    disabled={disabled}
                >
                    <Image />
                </button>
                <span className={ "tooltip-text" + ((uploadError ) ? " error-visible tooltip-error" : "") }>
                    {uploadError ? uploadError : disabled ?  "Servicio de imágenes no disponible" : "Adjuntar imagen (png, jpg, jpeg)"}
                </span>
            </div>
        </div>
    )
}