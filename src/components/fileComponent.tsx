import React from "react"
import formatFileName from "../utils"
import { File } from "lucide-react";

export function FileComponent({
    style,
    name,
}:{
    style?: React.CSSProperties;
    name: string;
}) {

    return (
        <div style={style} className={"cl-file-container"}>
            <File className="icon-file" />
            <span>{formatFileName(name)}</span>
        </div>
    )
}