import React, { useEffect, useState } from "react";

export function Imagen({
        file,
        style,
        className,
        onClick
    } : 
    {
        file: File;
        style?: React.CSSProperties;
        className: string,
        onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
    }) {

    const [objectUrl, setObjectUrl] = useState<string>("");

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setObjectUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);


    return (
        <img
            key={objectUrl}
            style={style}
            src={objectUrl}
            alt="file"
            className={className}
            onClick={onClick} 
        />
    )
}