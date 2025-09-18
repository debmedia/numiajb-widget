import React from "react"
import { File } from "lucide-react";
import formatFileName from "../utils/handle-file-name";

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