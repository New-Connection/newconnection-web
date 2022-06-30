import { FileUploader } from "react-drag-drop-files";
import ImageIcon from "assets/ImageIcon.png";
import Image from "next/image";

import { IDragAndDrop } from "./types";
import { useState } from "react";

const fileTypes = ["JPEG", "PNG", "JPG"];

export const DragAndDropImage = ({
    label,
    name,
    className,
    multipleFiles = false,
    hoverTitle,
    handleChange,
    ...props
}: IDragAndDrop) => {
    return (
        <div className={className}>
            <div className="input-label">{label}</div>
            <FileUploader
                hoverTitle={hoverTitle}
                multiple={multipleFiles}
                handleChange={handleChange}
                name={name}
                maxSize={1}
                types={fileTypes}
                {...props}
            >
                <div
                    className="flex flex-col justify-center text-center border-dashed
                               rounded-md border-2 border-[#1bdbad]
                               bg-slate-800 bg-[#fdfdfda6] hover:border-slate-800 items-center h-40"
                >
                    <Image src={ImageIcon} width={"50"} height={"50"} />
                    <p className="text-slate-500 mt-1">PNG, JPEG and JPG accept. Max 1mb.</p>
                    {/* <p className='text-slate-400'>{file ? `File name: ${file?.name} ✅` : "PNG, JPEG and JPG accept. Max 1mb."}</p> */}
                </div>
            </FileUploader>
        </div>
    );
};
